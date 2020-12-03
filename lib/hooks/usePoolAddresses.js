import { batch, contract } from '@pooltogether/etherplex'
import { useAtom } from 'jotai'
import { poolAddressesAtom, prizePoolTypeAtom } from 'lib/components/PoolUI'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { PrizePoolType } from 'lib/constants'
import { useContext, useEffect } from 'react'

import SingleRandomWinnerAbi from '@pooltogether/pooltogether-contracts/abis/SingleRandomWinner'
import CompoundPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/CompoundPrizePool'
import StakePrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/StakePrizePool'

export const usePoolAddresses = () => {
  const [poolAddresses, setPoolAddresses] = useAtom(poolAddressesAtom)
  const [poolType] = useAtom(prizePoolTypeAtom)
  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider

  const { prizePool, ticket } = poolAddresses

  useEffect(() => {
    if (!provider) return

    const fetchPoolAddresses = async () => {
      if (prizePool && !ticket) {
        try {
          if (poolType === PrizePoolType.compound) {
            // Query Prize Pool
            const etherplexPrizePoolContract = contract(
              'prizePool',
              CompoundPrizePoolAbi,
              prizePool
            )
            const poolValues = await batch(
              provider,
              etherplexPrizePoolContract
                .token()
                .cToken()
                .prizeStrategy()
            )

            const { token, cToken, prizeStrategy } = poolValues.prizePool
            // Query Prize Strategy
            const etherplexPrizeStrategyContract = contract(
              'prizeStrategy',
              SingleRandomWinnerAbi,
              prizeStrategy[0]
            )
            const strategyValues = await batch(
              provider,
              etherplexPrizeStrategyContract
                .tokenListener() // comptroller
                .rng()
                .sponsorship()
                .ticket()
            )
            const { rng, sponsorship, ticket, tokenListener } = strategyValues.prizeStrategy
            // Update State
            setPoolAddresses((existingValues) => ({
              ...existingValues,
              tokenListener: tokenListener[0],
              token: token[0],
              cToken: cToken[0],
              prizeStrategy: prizeStrategy[0],
              rng: rng[0],
              sponsorship: sponsorship[0],
              ticket: ticket[0]
            }))
          } else if (poolType === PrizePoolType.stake) {
            // Query Prize Pool
            const etherplexPrizePoolContract = contract('prizePool', StakePrizePoolAbi, prizePool)
            const poolValues = await batch(
              provider,
              etherplexPrizePoolContract.token().prizeStrategy()
            )
            const { token, stakeToken, prizeStrategy } = poolValues.prizePool
            // Query Prize Strategy
            const etherplexPrizeStrategyContract = contract(
              'prizeStrategy',
              SingleRandomWinnerAbi,
              prizeStrategy[0]
            )
            const strategyValues = await batch(
              provider,
              etherplexPrizeStrategyContract
                .tokenListener() // comptroller
                .rng()
                .sponsorship()
                .ticket()
            )
            const { rng, sponsorship, ticket, tokenListener } = strategyValues.prizeStrategy
            // Update State
            setPoolAddresses((existingValues) => ({
              ...existingValues,
              tokenListener: tokenListener[0],
              token: token[0],
              prizeStrategy: prizeStrategy[0],
              rng: rng[0],
              sponsorship: sponsorship[0],
              ticket: ticket[0]
            }))
          }
        } catch (e) {
          console.error(e)

          setPoolAddresses({
            error: true,
            errorMessage: e.message
          })

          return
        }
      }
    }

    fetchPoolAddresses()
  }, [prizePool, ticket, poolType, provider])
}
