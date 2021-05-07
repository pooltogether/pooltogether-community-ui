import { useMemo } from 'react'
import { batch, contract } from '@pooltogether/etherplex'
import { useAtom } from 'jotai'
import { useQuery } from 'react-query'
import compareVersions from 'compare-versions'
import { useRouter } from 'next/router'

import { errorStateAtom } from 'lib/atoms'
import {
  CONTRACT_VERSIONS,
  NO_REFETCH_QUERY_OPTIONS,
  POOL_ALIASES,
  PRIZE_POOL_TYPE,
  QUERY_KEYS
} from 'lib/constants'
import { useNetwork } from 'lib/hooks/useNetwork'
import { useReadProvider } from 'lib/hooks/useReadProvider'
import { determinePrizePoolType } from 'lib/hooks/usePrizePoolType'

import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'
import MultipleWinnersAbi from '@pooltogether/pooltogether-contracts/abis/MultipleWinners'
import RegistryAbi from '@pooltogether/pooltogether-contracts/abis/Registry'
import CompoundPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/CompoundPrizePool'
import StakePrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/StakePrizePool'
import YieldSourcePrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/YieldSourcePrizePool'
import { isValidAddress } from 'lib/utils/isValidAddress'
import { usePrizePoolAddress } from 'lib/hooks/usePrizePoolAddress'

export const usePrizePoolContracts = () => {
  const { chainId } = useNetwork()
  const [, setErrorState] = useAtom(errorStateAtom)
  const { readProvider: provider, isLoaded: readProviderLoaded } = useReadProvider()
  const prizePoolAddress = usePrizePoolAddress()

  const poolAddressIsValid = isValidAddress(prizePoolAddress)
  const enabled = readProviderLoaded && Boolean(prizePoolAddress) && poolAddressIsValid

  return useQuery(
    [QUERY_KEYS.contractVersions, chainId, prizePoolAddress],
    async () => await _fetchPrizePoolContracts(provider, chainId, prizePoolAddress, setErrorState),
    // @ts-ignore
    {
      ...NO_REFETCH_QUERY_OPTIONS,
      enabled,
      staleTime: Infinity
    }
  )
}

const _fetchPrizePoolContracts = async (provider, chainId, prizePoolAddress, setErrorState) => {
  try {
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
      ...remainingPrizePoolAddresses,
      invalidPrizePoolAddress: false
    }
  } catch (e) {
    console.error(e)
    return { ...EMPTY_CONTRACT_ADDRESSES, invalidPrizePoolAddress: true }
  }
}

const _fetchPrizeAndStrategyContractVersions = async (
  provider,
  chainId,
  prizePoolAddress,
  setErrorState
) => {
  let unknownContractAddresses = []

  // Prize Pool
  const prizePoolByteCode = await provider.getCode(prizePoolAddress)

  let prizePoolVersion = {
    address: prizePoolAddress.toLowerCase(),
    contract: 'StakePrizePool',
    version: '3.2.0'
  }
  const actualPrizePoolVersion = CONTRACT_VERSIONS[chainId]?.[prizePoolByteCode]
  if (actualPrizePoolVersion) {
    prizePoolVersion = { address: prizePoolAddress, ...actualPrizePoolVersion }
  } else {
    unknownContractAddresses.push(prizePoolAddress)
  }

  // Prize Strategy
  const prizePoolContract = contract('prizePool', PrizePoolAbi, prizePoolAddress)
  const prizePoolValues = await batch(provider, prizePoolContract.prizeStrategy())
  const prizeStrategyAddress = prizePoolValues.prizePool.prizeStrategy[0].toLowerCase()
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
    unknownContractAddresses.push(prizeStrategyAddress)
  }

  setErrorState((errorState) => ({
    ...errorState,
    unknownContracts: [...errorState.unknownContracts, ...unknownContractAddresses]
  }))

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

  // Prize Pool data
  const firstRequests = []
  const prizePoolContract = contract('prizePoolData', prizePoolAbi, prizePool.address)
  firstRequests.push(prizePoolContract.token().reserveRegistry())

  // Prize Pool type specific cases
  if (prizePoolType === PRIZE_POOL_TYPE.compound) {
    firstRequests.push(prizePoolContract.cToken())
  } else if (prizePoolType === PRIZE_POOL_TYPE.yield) {
    firstRequests.push(prizePoolContract.yieldSource())
  }

  const { prizePoolData } = await batch(provider, ...firstRequests)

  // Prize Strategy data & Reserve data
  const secondRequests = []
  const prizeStrategyContract = contract(
    'prizeStrategyData',
    MultipleWinnersAbi,
    prizeStrategy.address
  )
  const registryAddress = prizePoolData.reserveRegistry[0]
  const registryContract = contract('registry', RegistryAbi, registryAddress)
  secondRequests.push()
  secondRequests.push(
    prizeStrategyContract
      .tokenListener() // comptroller
      .rng()
      .sponsorship()
      .ticket(),
    registryContract.lookup()
  )
  // Version Specific cases
  if (compareVersions(prizeStrategy.version, '3.3.0') >= 0) {
    secondRequests.push(prizeStrategyContract.beforeAwardListener())
  }

  const { prizeStrategyData, registry } = await batch(provider, ...secondRequests)

  const addresses = {
    reserve: { address: registry.lookup[0] },
    rng: { address: '' },
    sponsorship: { address: '' },
    ticket: { address: '' },
    token: { address: '' },
    cToken: { address: '' },
    yieldSource: { address: '' },
    tokenListener: { address: '' },
    beforeAwardListener: { address: '' }
  }

  Object.keys(prizeStrategyData).forEach((key) => {
    addresses[key] = { address: prizeStrategyData[key][0].toLowerCase() }
  })
  Object.keys(prizePoolData).forEach((key) => {
    addresses[key] = { address: prizePoolData[key][0].toLowerCase() }
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
  reserve: { address: '' },
  rng: { address: '' },
  sponsorship: { address: '' },
  ticket: { address: '' },
  token: { address: '' },
  tokenListener: { address: '' },
  beforeAwardListener: { address: '' },
  yieldSource: { address: '' },
  invalidPrizePoolAddress: false
})
