import { useEffect, useMemo } from 'react'
import { batch, contract } from '@pooltogether/etherplex'
import { atom, useAtom } from 'jotai'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'
import compareVersions from 'compare-versions'

import { POOL_ALIASES, PRIZE_POOL_TYPE } from 'lib/constants'
import { errorStateAtom, getDataFetchingErrorMessage } from 'lib/components/PoolData'
import { useReadProvider } from 'lib/hooks/useReadProvider'
import { contractVersionsAtom, prizePoolTypeAtom } from 'lib/hooks/useDetermineContractVersions'
import { erc20AwardsAtom } from 'lib/hooks/useExternalErc20Awards'
import { userChainValuesAtom } from 'lib/hooks/useUserChainValues'
import { poolChainValuesAtom } from 'lib/hooks/usePoolChainValues'

// TODO: May need to locally cache previous version ABIs and switch between them depending
// on version of contract
import MultipleWinnersAbi from '@pooltogether/pooltogether-contracts/abis/MultipleWinners'
import CompoundPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/CompoundPrizePool'
import StakePrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/StakePrizePool'
import YieldPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/YieldSourcePrizePool'
import { useNetwork } from 'lib/hooks/useNetwork'

export const poolAddressesAtom = atom({})

export const usePoolAddresses = () => {
  const router = useRouter()

  const [poolAddresses, setPoolAddresses] = useAtom(poolAddressesAtom)
  const [errorState, setErrorState] = useAtom(errorStateAtom)
  const [contractVersions, setContractVersions] = useAtom(contractVersionsAtom)
  const [chainId] = useNetwork()
  const [prizePoolType] = useAtom(prizePoolTypeAtom)
  const [erc20Awards, setErc20Awards] = useAtom(erc20AwardsAtom)
  const [userChainValues, setUserChainValues] = useAtom(userChainValuesAtom)
  const [poolChainValues, setPoolChainValues] = useAtom(poolChainValuesAtom)

  const poolAlias = router.query.poolAlias

  const prizePoolAddress = useMemo(() => {
    return poolAlias ? POOL_ALIASES[poolAlias]?.poolAddress : router.query.prizePoolAddress
  }, [poolAlias, router.query.prizePoolAddress])
  const { readProvider: provider, isLoaded: readProviderLoaded } = useReadProvider()

  const { prizePool, ticket } = poolAddresses

  useEffect(() => {
    setPoolAddresses({
      prizePool: prizePoolAddress
    })
    setContractVersions({})
    setErc20Awards({
      loading: true,
      awards: []
    })
    setUserChainValues({
      loading: true,
      usersTicketBalance: ethers.BigNumber.from(0),
      usersTokenAllowance: ethers.BigNumber.from(0),
      usersTokenBalance: ethers.BigNumber.from(0)
    })
    setPoolChainValues({
      loading: true
    })
  }, [poolAlias, prizePoolAddress, chainId])

  useEffect(() => {
    if (!readProviderLoaded || !prizePoolType) return

    const fetchPoolAddresses = async () => {
      if (prizePool && !ticket) {
        try {
          const poolAddresses = await _fetchPrizePoolAddresses(
            prizePoolType,
            prizePool,
            provider,
            contractVersions
          )

          setPoolAddresses((existingValues) => ({
            ...existingValues,
            ...poolAddresses
          }))
        } catch (e) {
          setErrorState({
            error: true,
            errorMessage: getDataFetchingErrorMessage(prizePool, 'pool addresses', e.message)
          })
          return
        }
      }
    }

    fetchPoolAddresses()
  }, [prizePool, ticket, prizePoolType, provider, readProviderLoaded])

  return [poolAddresses, setPoolAddresses]
}

const _fetchPrizePoolAddresses = async (prizePoolType, prizePool, provider, contractVersions) => {
  let prizePoolAbi
  if (prizePoolType === PRIZE_POOL_TYPE.compound) {
    prizePoolAbi = CompoundPrizePoolAbi
  } else if (prizePoolType === PRIZE_POOL_TYPE.stake) {
    prizePoolAbi = StakePrizePoolAbi
  } else if (prizePoolType === PRIZE_POOL_TYPE.yield) {
    prizePoolAbi = StakePrizePoolAbi
  }

  // Default Prize Pool data
  const prizePoolRequests = []
  const prizePoolContract = contract('prizePoolData', prizePoolAbi, prizePool)
  prizePoolRequests.push(prizePoolContract.token().prizeStrategy())

  // Prize Pool type specific cases
  if (prizePoolType === PRIZE_POOL_TYPE.compound) {
    prizePoolRequests.push(prizePoolContract.cToken())
  }

  const { prizePoolData } = await batch(provider, ...prizePoolRequests)
  const { prizeStrategy } = prizePoolData

  // Default Prize Strategy data
  const prizeStrategyRequests = []
  const prizeStrategyContract = contract('prizeStrategyData', MultipleWinnersAbi, prizeStrategy[0])
  prizeStrategyRequests.push(
    prizeStrategyContract
      .tokenListener() // comptroller
      .rng()
      .sponsorship()
      .ticket()
  )

  // Version Specific cases
  if (compareVersions(contractVersions.prizeStrategy.version, '3.3.0') >= 0) {
    prizeStrategyRequests.push(prizeStrategyContract.beforeAwardListener())
  }

  const { prizeStrategyData } = await batch(provider, ...prizeStrategyRequests)
  const addresses = {}
  Object.keys(prizePoolData).forEach((key) => (addresses[key] = prizePoolData[key][0]))
  Object.keys(prizeStrategyData).forEach((key) => (addresses[key] = prizeStrategyData[key][0]))

  return addresses
}
