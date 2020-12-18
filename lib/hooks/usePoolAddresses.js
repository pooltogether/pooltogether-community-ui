import { useContext, useEffect, useMemo } from 'react'
import { batch, contract } from '@pooltogether/etherplex'
import { atom, useAtom } from 'jotai'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'

import { errorStateAtom, getDataFetchingErrorMessage } from 'lib/components/PoolData'
import { PRIZE_POOL_TYPE } from 'lib/constants'
import { useReadProvider } from 'lib/hooks/useReadProvider'
import { prizePoolTypeAtom } from 'lib/hooks/usePrizePoolType'
import { erc20AwardsAtom } from 'lib/hooks/useExternalErc20Awards'
import { userChainValuesAtom } from 'lib/hooks/useUserChainValues'
import { poolChainValuesAtom } from 'lib/hooks/usePoolChainValues'

import MultipleWinnersAbi from '@pooltogether/pooltogether-contracts/abis/MultipleWinners'
import CompoundPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/CompoundPrizePool'
import StakePrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/StakePrizePool'
import { networkAtom } from 'lib/hooks/useNetwork'

export const poolAddressesAtom = atom({})

export const usePoolAddresses = () => {
  const [poolAddresses, setPoolAddresses] = useAtom(poolAddressesAtom)
  const [errorState, setErrorState] = useAtom(errorStateAtom)
  const [prizePoolType, setPrizePoolType] = useAtom(prizePoolTypeAtom)
  const [network] = useAtom(networkAtom)
  const [erc20Awards, setErc20Awards] = useAtom(erc20AwardsAtom)
  const [userChainValues, setUserChainValues] = useAtom(userChainValuesAtom)
  const [poolChainValues, setPoolChainValues] = useAtom(poolChainValuesAtom)
  const router = useRouter()
  const prizePoolAddress = useMemo(() => router.query.prizePoolAddress, [
    router.query.prizePoolAddress
  ])
  const provider = useReadProvider()

  const { prizePool, ticket } = poolAddresses

  useEffect(() => {
    setPoolAddresses({
      prizePool: prizePoolAddress
    })
    setErc20Awards({
      loading: true,
      awards: []
    })
    setUserChainValues({
      loading: true,
      usersTicketBalance: ethers.utils.bigNumberify(0),
      usersTokenAllowance: ethers.utils.bigNumberify(0),
      usersTokenBalance: ethers.utils.bigNumberify(0)
    })
    setPrizePoolType('')
    setPoolChainValues({
      loading: true
    })
  }, [prizePoolAddress])

  useEffect(() => {
    if (!provider || !prizePoolType) return

    const fetchPoolAddresses = async () => {
      if (prizePool && !ticket) {
        try {
          if (prizePoolType === PRIZE_POOL_TYPE.compound) {
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
              MultipleWinnersAbi,
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
          } else if (prizePoolType === PRIZE_POOL_TYPE.stake) {
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
              MultipleWinnersAbi,
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
          setErrorState({
            error: true,
            errorMessage: getDataFetchingErrorMessage(prizePool, 'pool addresses', e.message)
          })
          return
        }
      }
    }

    fetchPoolAddresses()
  }, [prizePool, ticket, prizePoolType, provider])

  return [poolAddresses, setPoolAddresses]
}
