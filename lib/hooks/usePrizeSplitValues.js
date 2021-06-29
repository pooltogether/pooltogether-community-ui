import { batch, contract } from '@pooltogether/etherplex'
import { useQuery } from 'react-query'
import { useReadProvider } from '@pooltogether/hooks'

import { useNetwork } from 'lib/hooks/useNetwork'
import MultipleWinnersPrizeStrategyAbi from '@pooltogether/pooltogether-contracts/abis/MultipleWinners'

export const usePrizeSplitValues = (prizeStrategyAddress) => {
  const { chainId } = useNetwork()
  const { readProvider } = useReadProvider(chainId)
  return useQuery([prizeStrategyAddress, chainId], async () => {
    const etherplexPrizeStrategyContract = contract(
      'prizeStrategy',
      MultipleWinnersPrizeStrategyAbi,
      prizeStrategyAddress
    )

    const { prizeStrategy } = await batch(
      readProvider,
      etherplexPrizeStrategyContract.prizeSplits()
    )

    return { prizeSplits: prizeStrategy.prizeSplits[0] }
  })
}
