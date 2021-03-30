import { useQuery } from 'react-query'
import { ethers } from 'ethers'

import { contractAddresses } from '@pooltogether/current-pool-data'
import PoolWithMultipleWinnersBuilderAbi from '@pooltogether/pooltogether-contracts/abis/PoolWithMultipleWinnersBuilder'

import {
  NETWORKS_WITHOUT_LOGS,
  NO_REFETCH_QUERY_OPTIONS,
  PRIZE_POOL_BUILDERS,
  PRIZE_POOL_TYPE,
  QUERY_KEYS
} from 'lib/constants'
import { useNetwork } from 'lib/hooks/useNetwork'
import { useReadProvider } from 'lib/hooks/useReadProvider'

// If logs aren't supported, we can add the full list here
// TODO: Get a better list than this random pool
const PRIZE_POOL_LIST_FALLBACK = Object.freeze({
  137: [
    {
      type: PRIZE_POOL_TYPE.stake,
      prizePool: '0x9925bfd6e87d5e18d34a808d20acb76dfd2973e6',
      prizeStrategy: '0x3B1F25B0aC037b6cDf217dF1F45D893222662C53'
    }
  ]
})

export const useAllCreatedPrizePools = () => {
  const { chainId } = useNetwork()
  const { readProvider: provider, isLoaded: readProviderIsLoaded } = useReadProvider()

  return useQuery(
    [QUERY_KEYS.useAllCreatedPrizePools, chainId],
    async () => await getAllCreatedPrizePools(provider, chainId),
    // @ts-ignore
    {
      ...NO_REFETCH_QUERY_OPTIONS,
      enabled: chainId && readProviderIsLoaded,
      staleTime: Infinity
    }
  )
}

const getAllCreatedPrizePools = async (provider, chainId) => {
  try {
    const prizePoolBuilderVersions = PRIZE_POOL_BUILDERS[chainId]

    if (NETWORKS_WITHOUT_LOGS.includes(chainId)) {
      return PRIZE_POOL_LIST_FALLBACK[chainId]
    }

    const prizePools = []
    for (const builder of prizePoolBuilderVersions) {
      const { address, blockNumber } = builder
      const builderContract = new ethers.Contract(
        address,
        PoolWithMultipleWinnersBuilderAbi,
        provider
      )

      // NOTE: Dependant on there only being "pool created" events
      let builderLogs = []

      // TODO: Maticvigil only supports logs for 1000 blocks at a time
      if (![80001, 137].includes(chainId)) {
        builderLogs = await provider.getLogs({
          address,
          fromBlock: blockNumber
        })
      }

      builderLogs.forEach((log) => {
        const parsedLog = builderContract.interface.parseLog(log)

        prizePools.push({
          type: getPrizePoolType(parsedLog.name),
          prizePool: parsedLog.args.prizePool,
          prizeStrategy: parsedLog.args.prizeStrategy
        })
      })
    }

    // Dai pool was made with a different build process
    if (chainId === 1) {
      prizePools.push({
        type: 'Compound',
        prizePool: contractAddresses[1].dai.prizePool,
        prizeStrategy: contractAddresses[1].dai.prizeStrategy
      })
    }

    return prizePools
  } catch (e) {
    console.error(e.message)
    return []
  }
}

const getPrizePoolType = (eventName) => {
  switch (eventName) {
    case 'CompoundPrizePoolWithMultipleWinnersCreated':
      return 'Compound'
    case 'StakePrizePoolWithMultipleWinnersCreated':
      return 'Stake'
    case 'YieldSourcePrizePoolWithMultipleWinnersCreated':
      return 'Yield'
    default:
      return ''
  }
}
