import { batch, contract } from '@pooltogether/etherplex'
import { useQuery } from 'react-query'
import { useReadProvider } from '@pooltogether/hooks'

import { useNetwork } from 'lib/hooks/useNetwork'
import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'
import MultipleWinnersPrizeStrategyAbi from '@pooltogether/pooltogether-contracts/abis/MultipleWinners'

/**
 * @name usePrizeSplitValues
 * @description Read the PrizeStrategy prize split, ticket, sponsorship and PrizePool tokens values.
 * @param {*} prizeStrategyAddress
 * @param {*} prizePoolAddress
 */
export const usePrizeSplitValues = (prizeStrategyAddress, prizePoolAddress) => {
  const { chainId } = useNetwork()
  const { readProvider } = useReadProvider(chainId)

  return useQuery([prizeStrategyAddress, chainId], async () => {
    const etherplexPrizeStrategyContract = contract(
      'prizeStrategy',
      MultipleWinnersPrizeStrategyAbi,
      prizeStrategyAddress
    )
    const etherplexPrizePoolContract = contract('prizePool', PrizePoolAbi, prizePoolAddress)

    const { prizeStrategy, prizePool } = await batch(
      readProvider,
      etherplexPrizeStrategyContract.prizeSplits().ticket().sponsorship(),
      etherplexPrizePoolContract.tokens()
    )

    return {
      prizeSplits: prizeStrategy.prizeSplits[0],
      ticket: prizeStrategy.ticket[0],
      sponsorship: prizeStrategy.sponsorship[0],
      tokens: prizePool.tokens[0]
    }
  })
}
