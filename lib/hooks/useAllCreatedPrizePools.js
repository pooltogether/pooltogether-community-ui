import { useQuery } from 'react-query'
import { ethers } from 'ethers'

import PoolWithMultipleWinnersBuilderAbi from '@pooltogether/pooltogether-contracts/abis/PoolWithMultipleWinnersBuilder'

import { PRIZE_POOL_BUILDERS, QUERY_KEYS } from 'lib/constants'
import { useNetwork } from 'lib/hooks/useNetwork'
import { useReadProvider } from 'lib/hooks/useReadProvider'
import { contractAddresses } from '@pooltogether/current-pool-data'

export const useAllCreatedPrizePools = () => {
  const [chainId] = useNetwork()
  const { readProvider: provider, isLoaded: readProviderIsLoaded } = useReadProvider()

  return useQuery(
    [QUERY_KEYS.useAllCreatedPrizePools, chainId],
    async () => getAllCreatedPrizePools(provider, chainId),
    {
      enabled: chainId && readProviderIsLoaded,
      refetchInterval: false,
      refetchOnWindowFocus: false
    }
  )
}

const getAllCreatedPrizePools = async (provider, chainId) => {
  try {
    const prizePoolBuilderVersions = PRIZE_POOL_BUILDERS[chainId]

    const prizePools = []
    for (const builder of prizePoolBuilderVersions) {
      const { address, blockNumber } = builder
      const builderContract = new ethers.Contract(
        address,
        PoolWithMultipleWinnersBuilderAbi,
        provider
      )

      // NOTE: Dependant on there only being "pool created" events
      const builderLogs = await provider.getLogs({
        address,
        fromBlock: blockNumber
      })

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
