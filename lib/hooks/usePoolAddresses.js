import { useEffect, useMemo } from 'react'
import { batch, contract } from '@pooltogether/etherplex'
import { atom, useAtom } from 'jotai'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'

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
      usersTicketBalance: ethers.utils.bigNumberify(0),
      usersTokenAllowance: ethers.utils.bigNumberify(0),
      usersTokenBalance: ethers.utils.bigNumberify(0)
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
  }, [prizePool, ticket, prizePoolType, provider, readProviderLoaded])

  return [poolAddresses, setPoolAddresses]
}
