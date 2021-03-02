import { useQuery } from 'react-query'
import { ethers } from 'ethers'

import PoolWithMultipleWinnersBuilderAbi from '@pooltogether/pooltogether-contracts/abis/PoolWithMultipleWinnersBuilder'

import { QUERY_KEYS } from 'lib/constants'
import { useNetwork } from 'lib/hooks/useNetwork'
import { useReadProvider } from 'lib/hooks/useReadProvider'

export const useAllCreatedPrizePools = () => {
  const { id: chainId } = useNetwork()
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
    const prizePoolBuilderVersions = [
      {
        address: '0x0780B754aD492040DBe84E0A6664B54e3159C64c',
        blockNumber: 8062650
      },
      {
        address: '0x13422C0bc0F5429D05A8e7A3d908072d877fa19D',
        blockNumber: 7976000
      },
      {
        address: '0x47a5ABfAcDebf5af312B034B3b748935A0259136',
        blockNumber: 7687017
      },
      {
        address: '0xC18aA45DBF6EcEf439E967241872FBE0242c05cE',
        blockNumber: 7679937
      }
    ]

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
          prizePool: parsedLog.values.prizePool,
          prizeStrategy: parsedLog.values.prizeStrategy
        })
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
    default:
      return ''
  }
}
