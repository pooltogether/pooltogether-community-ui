import { QUERY_KEYS } from 'lib/constants'
import { useAllCreatedPrizePools } from 'lib/hooks/useAllCreatedPrizePools'
import { useReadProvider } from 'lib/hooks/useReadProvider'
import { useQuery } from 'react-query'

import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'
import MultipleWinnersPrizeStrategyAbi from '@pooltogether/pooltogether-contracts/abis/MultipleWinners'
import { batch, contract } from '@pooltogether/etherplex'
import { useNetwork } from 'lib/hooks/useNetwork'

export const useAllCreatedPrizePoolsWithTokens = () => {
  const [chainId] = useNetwork()
  const { data: prizePools, isFetched: createdPrizePoolsIsFetched } = useAllCreatedPrizePools()
  const { readProvider: provider, isLoaded: readProviderIsLoaded } = useReadProvider()

  return useQuery(
    [QUERY_KEYS.useAllCreatedPrizePoolsWithTokens, prizePools, chainId],
    async () => getAllCreatedPrizePoolsWithTokens(provider, prizePools, chainId),
    {
      enabled: readProviderIsLoaded && createdPrizePoolsIsFetched,
      refetchInterval: false,
      refetchOnWindowFocus: false
    }
  )
}

const getAllCreatedPrizePoolsWithTokens = async (provider, prizePools, chainId) => {
  console.log('getAllCreatedPrizePoolsWithTokens', chainId, provider)
  try {
    const prizePoolChainData = []

    const prizePoolsFiltered = prizePools.filter(
      (prizePool) => !BLOCK_LIST.includes(prizePool.prizePool)
    )

    const batchRequests = []
    for (const prizePool of prizePoolsFiltered) {
      const { prizePool: prizePoolAddress, prizeStrategy: prizeStrategyAddress } = prizePool
      const prizePoolContract = contract(prizePoolAddress, PrizePoolAbi, prizePoolAddress)
      const prizeStrategyContract = contract(
        prizeStrategyAddress,
        MultipleWinnersPrizeStrategyAbi,
        prizeStrategyAddress
      )
      batchRequests.push(prizePoolContract.token().owner(), prizeStrategyContract.ticket())
    }

    const values = await batch(provider, ...batchRequests)

    for (const prizePool of prizePoolsFiltered) {
      const { prizePool: prizePoolAddress, prizeStrategy: prizeStrategyAddress } = prizePool
      const token = values[prizePoolAddress].token[0]
      const prizePoolOwner = values[prizePoolAddress].owner[0]
      const ticket = values[prizeStrategyAddress].ticket[0]
      prizePoolChainData.push({
        ...prizePool,
        token,
        ticket,
        prizePoolOwner
      })
    }

    return prizePoolChainData
  } catch (e) {
    console.error(e.message)
    return []
  }
}

// Addresses of Prize Pools that were incorrectly deployed
// Ex. '0x' for 'ticket' address
// A single error causes all of etherplex to fail
const BLOCK_LIST = [
  '0x41eE149372238fBcE0F3C5E7076Aa253d0fc4c70',
  '0x73216F8173959b6aBB6e78e80BD251071787042C',
  '0x96E22522fc2dA00c74227f77D976f9B878eE5A62'
]
