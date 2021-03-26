import { useMemo } from 'react'
import { batch, contract } from '@pooltogether/etherplex'
import { useAtom } from 'jotai'
import { useQuery } from 'react-query'
import compareVersions from 'compare-versions'
import { useRouter } from 'next/router'

import { errorStateAtom } from 'lib/atoms'
import { CONTRACT_VERSIONS, POOL_ALIASES, PRIZE_POOL_TYPE, QUERY_KEYS } from 'lib/constants'
import { useNetwork } from 'lib/hooks/useNetwork'
import { useReadProvider } from 'lib/hooks/useReadProvider'
import { determinePrizePoolType } from 'lib/hooks/usePrizePoolType'

import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'
import MultipleWinnersAbi from '@pooltogether/pooltogether-contracts/abis/MultipleWinners'
import CompoundPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/CompoundPrizePool'
import StakePrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/StakePrizePool'
import YieldSourcePrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/YieldSourcePrizePool'

export const usePrizePoolContracts = () => {
  const { chainId } = useNetwork()
  const [, setErrorState] = useAtom(errorStateAtom)
  const { readProvider: provider, isLoaded: readProviderLoaded } = useReadProvider()
  const router = useRouter()

  const poolAlias = Array.isArray(router.query.poolAlias)
    ? router.query.poolAlias[0]
    : router.query.poolAlias
  const prizePoolAddress = useMemo(() => {
    if (poolAlias) {
      const aliasMapping = POOL_ALIASES[poolAlias]
      if (aliasMapping) {
        return aliasMapping.poolAddress
      }
    }
    return Array.isArray(router.query.prizePoolAddress)
      ? router.query.prizePoolAddress[0]
      : router.query.prizePoolAddress
  }, [poolAlias, router.query.prizePoolAddress, chainId])

  const enabled = readProviderLoaded && Boolean(prizePoolAddress)

  return useQuery(
    [QUERY_KEYS.contractVersions, chainId, prizePoolAddress],
    async () => _fetchPrizePoolContracts(provider, chainId, prizePoolAddress, setErrorState),
    {
      enabled,
      refetchInterval: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      placeholderData: { ...EMPTY_CONTRACT_ADDRESSES }
    }
  )
}

const _fetchPrizePoolContracts = async (provider, chainId, prizePoolAddress, setErrorState) => {
  const contractVersions = await _fetchPrizeAndStrategyContractVersions(
    provider,
    chainId,
    prizePoolAddress,
    setErrorState
  )

  const remainingPrizePoolAddresses = await _fetchRemainingPrizePoolAddresses(
    provider,
    contractVersions.prizePool,
    contractVersions.prizeStrategy
  )

  return {
    ...contractVersions,
    ...remainingPrizePoolAddresses
  }
}

const _fetchPrizeAndStrategyContractVersions = async (
  provider,
  chainId,
  prizePoolAddress,
  setErrorState
) => {
  // Prize Pool
  const prizePoolByteCode = await provider.getCode(prizePoolAddress)
  let prizePoolVersion = {
    address: prizePoolAddress,
    contract: 'StakePrizePool',
    version: '3.2.0'
  }
  const actualPrizePoolVersion = CONTRACT_VERSIONS[chainId]?.[prizePoolByteCode]
  if (actualPrizePoolVersion) {
    prizePoolVersion = { address: prizePoolAddress, ...actualPrizePoolVersion }
  } else {
    setErrorState((errorState) => ({
      ...errorState,
      unknownContracts: [...errorState.unknownContracts, prizePoolAddress]
    }))
  }

  // Prize Strategy
  const prizePoolContract = contract('prizePool', PrizePoolAbi, prizePoolAddress)
  const prizePoolValues = await batch(provider, prizePoolContract.prizeStrategy())
  const prizeStrategyAddress = prizePoolValues.prizePool.prizeStrategy[0]
  const prizeStrategyByteCode = await provider.getCode(prizeStrategyAddress)
  let prizeStrategyVersion = {
    address: prizeStrategyAddress,
    contract: 'MultipleWinners',
    version: '3.2.0'
  }
  const actualPrizeStrategyVersion = CONTRACT_VERSIONS[chainId]?.[prizeStrategyByteCode]
  if (actualPrizeStrategyVersion) {
    prizeStrategyVersion = { address: prizeStrategyAddress, ...actualPrizeStrategyVersion }
  } else {
    setErrorState((errorState) => ({
      ...errorState,
      unknownContracts: [...errorState.unknownContracts, prizeStrategyAddress]
    }))
  }

  const contractVersions = {
    prizePool: prizePoolVersion,
    prizeStrategy: prizeStrategyVersion
  }

  return contractVersions
}

const _fetchRemainingPrizePoolAddresses = async (provider, prizePool, prizeStrategy) => {
  let prizePoolAbi = YieldSourcePrizePoolAbi
  let prizePoolType = determinePrizePoolType(prizePool.contract)
  switch (prizePoolType) {
    case PRIZE_POOL_TYPE.compound: {
      prizePoolAbi = CompoundPrizePoolAbi
      break
    }
    case PRIZE_POOL_TYPE.stake: {
      prizePoolAbi = StakePrizePoolAbi
      break
    }
    case PRIZE_POOL_TYPE.yield: {
      prizePoolAbi = YieldSourcePrizePoolAbi
      break
    }
  }

  // Default Prize Pool data
  const prizePoolRequests = []
  const prizePoolContract = contract('prizePoolData', prizePoolAbi, prizePool.address)
  prizePoolRequests.push(prizePoolContract.token())

  // Prize Pool type specific cases
  if (prizePoolType === PRIZE_POOL_TYPE.compound) {
    prizePoolRequests.push(prizePoolContract.cToken())
  }

  const { prizePoolData } = await batch(provider, ...prizePoolRequests)

  // Default Prize Strategy data
  const prizeStrategyRequests = []
  const prizeStrategyContract = contract(
    'prizeStrategyData',
    MultipleWinnersAbi,
    prizeStrategy.address
  )
  prizeStrategyRequests.push(
    prizeStrategyContract
      .tokenListener() // comptroller
      .rng()
      .sponsorship()
      .ticket()
  )

  // Version Specific cases
  if (compareVersions(prizeStrategy.version, '3.3.0') >= 0) {
    prizeStrategyRequests.push(prizeStrategyContract.beforeAwardListener())
  }

  const { prizeStrategyData } = await batch(provider, ...prizeStrategyRequests)

  const addresses = {
    rng: { address: '' },
    sponsorship: { address: '' },
    ticket: { address: '' },
    token: { address: '' },
    cToken: { address: '' },
    tokenListener: { address: '' },
    beforeAwardListener: { address: '' }
  }

  Object.keys(prizePoolData).forEach((key) => {
    addresses[key] = { address: prizePoolData[key][0] }
  })
  Object.keys(prizeStrategyData).forEach((key) => {
    addresses[key] = { address: prizeStrategyData[key][0] }
  })

  return addresses
}

const EMPTY_CONTRACT_ADDRESSES = Object.freeze({
  prizePool: {
    address: '',
    contract: '',
    version: ''
  },
  prizeStrategy: {
    address: '',
    contract: '',
    version: ''
  },
  rng: { address: '' },
  sponsorship: { address: '' },
  ticket: { address: '' },
  token: { address: '' },
  tokenListener: { address: '' },
  beforeAwardListener: { address: '' }
})
