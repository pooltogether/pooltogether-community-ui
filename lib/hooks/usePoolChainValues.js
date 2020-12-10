import { useContext, useEffect } from 'react'
import { useAtom } from 'jotai'
import { ethers } from 'ethers'
import { batch, contract } from '@pooltogether/etherplex'

import { WalletContext } from 'lib/components/WalletContextProvider'
import {
  errorStateAtom,
  getDataFetchingErrorMessage,
  poolAddressesAtom,
  poolChainValuesAtom,
  prizePoolTypeAtom
} from 'lib/components/PoolUI'

import ERC20Abi from 'ERC20Abi'
import CTokenAbi from '@pooltogether/pooltogether-contracts/abis/CTokenInterface'
import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'
import SingleRandomWinnerAbi from '@pooltogether/pooltogether-contracts/abis/SingleRandomWinner'
import { PRIZE_POOL_TYPE } from 'lib/constants'

export const usePoolChainValues = (provider) => {
  const [poolAddresses] = useAtom(poolAddressesAtom)
  const [errorState, setErrorState] = useAtom(errorStateAtom)
  const [prizePoolType] = useAtom(prizePoolTypeAtom)
  const [poolChainValues, setPoolChainValues] = useAtom(poolChainValuesAtom)
  // const walletContext = useContext(WalletContext)
  // const provider = walletContext.state.provider

  useEffect(() => {
    if (!provider) return

    fetchPoolChainValues(provider, poolAddresses, prizePoolType, setPoolChainValues, setErrorState)
  }, [provider, poolAddresses])

  return [poolChainValues, setPoolChainValues]
}

export const fetchPoolChainValues = async (
  provider,
  poolAddresses,
  prizePoolType,
  setPoolChainValues,
  setErrorState
) => {
  const { prizeStrategy, ticket, sponsorship, token, cToken, prizePool } = poolAddresses
  if (provider && prizeStrategy && ticket && sponsorship && prizePool) {
    try {
      const etherplexPrizeStrategyContract = contract(
        'singleRandomWinner',
        SingleRandomWinnerAbi,
        prizeStrategy
      )
      const etherplexTicketContract = contract('ticket', ERC20Abi, ticket)
      const etherplexSponsorshipContract = contract('sponsorship', ERC20Abi, sponsorship)
      const etherplexTokenContract = contract('token', ERC20Abi, token)
      const etherplexPrizePoolContract = contract('prizePool', PrizePoolAbi, prizePool)

      const batchRequests = [
        etherplexPrizeStrategyContract
          .isRngRequested() // used to determine if the pool is locked
          .canStartAward()
          .canCompleteAward()
          .prizePeriodRemainingSeconds()
          .getExternalErc20Awards()
          .getExternalErc721Awards(),
        etherplexTicketContract
          .name()
          .symbol()
          .totalSupply()
          .decimals(),
        etherplexSponsorshipContract
          .name()
          .symbol()
          .totalSupply(),
        etherplexTokenContract.decimals().symbol(),
        etherplexPrizePoolContract
          .captureAwardBalance()
          .creditPlanOf(ticket)
          .maxExitFeeMantissa()
      ]

      if (prizePoolType === PRIZE_POOL_TYPE.compound) {
        const etherplexCTokenContract = contract('cToken', CTokenAbi, cToken)
        batchRequests.push(etherplexCTokenContract.supplyRatePerBlock())
      }

      const values = await batch(provider, ...batchRequests)

      const poolTotalSupply = ethers.utils
        .bigNumberify(values.ticket.totalSupply[0])
        .add(values.sponsorship.totalSupply[0])

      let decimals = values.token.decimals[0]
      // default to 18 if the ERC20 contract returns 0 for decimals
      decimals = decimals === 0 ? 18 : decimals

      setPoolChainValues((existingValues) => ({
        ...existingValues,
        canStartAward: values.singleRandomWinner.canStartAward[0],
        canCompleteAward: values.singleRandomWinner.canCompleteAward[0],
        externalErc20Awards: values.singleRandomWinner.getExternalErc20Awards[0],
        supplyRatePerBlock: values?.cToken?.supplyRatePerBlock[0],
        isRngRequested: values.singleRandomWinner.isRngRequested[0],
        prizePeriodRemainingSeconds: values.singleRandomWinner.prizePeriodRemainingSeconds[0],
        sponsorshipName: values.sponsorship.name,
        sponsorshipSymbol: values.sponsorship.symbol,
        sponsorshipTotalSupply: values.sponsorship.totalSupply[0],
        ticketName: values.ticket.name,
        ticketSymbol: values.ticket.symbol,
        ticketDecimals: values.ticket.decimals[0],
        ticketTotalSupply: values.ticket.totalSupply[0],
        awardBalance: values.prizePool.captureAwardBalance[0],
        ticketCreditRateMantissa: values.prizePool.creditPlanOf.creditRateMantissa,
        ticketCreditLimitMantissa: values.prizePool.creditPlanOf.creditLimitMantissa,
        maxExitFeeMantissa: values.prizePool.maxExitFeeMantissa[0],
        poolTotalSupply: poolTotalSupply,
        tokenDecimals: decimals,
        tokenSymbol: values.token.symbol[0],
        loading: false
      }))
    } catch (e) {
      setErrorState({
        error: true,
        errorMessage: getDataFetchingErrorMessage(prizePool, 'pool chain values', e.message)
      })
      return
    }
  }
}
