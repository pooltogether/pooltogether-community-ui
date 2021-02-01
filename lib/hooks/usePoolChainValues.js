import { useEffect } from 'react'
import { atom, useAtom } from 'jotai'
import { ethers } from 'ethers'
import { batch, contract } from '@pooltogether/etherplex'

import { errorStateAtom, getDataFetchingErrorMessage } from 'lib/components/PoolData'
import { CONTRACTS, DATA_REFRESH_POLLING_INTERVAL, PRIZE_POOL_TYPE } from 'lib/constants'
import { useReadProvider } from 'lib/hooks/useReadProvider'

import ERC20Abi from 'ERC20Abi'
import CTokenAbi from '@pooltogether/pooltogether-contracts/abis/CTokenInterface'
import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'
import MultipleWinnersPrizeStrategyAbi from '@pooltogether/pooltogether-contracts/abis/MultipleWinners'
import SingleRandomWinnerPrizeStrategyAbi from '@pooltogether/pooltogether-contracts/abis/SingleRandomWinner'
import { poolAddressesAtom } from 'lib/hooks/usePoolAddresses'
import { useInterval } from 'lib/hooks/useInterval'
import { contractVersionsAtom, prizePoolTypeAtom } from 'lib/hooks/useDetermineContractVersions'

export const poolChainValuesAtom = atom({
  loading: true
})

export const usePoolChainValues = () => {
  const [poolAddresses] = useAtom(poolAddressesAtom)
  const [errorState, setErrorState] = useAtom(errorStateAtom)
  const [prizePoolType] = useAtom(prizePoolTypeAtom)
  const [poolChainValues, setPoolChainValues] = useAtom(poolChainValuesAtom)
  const [contractVersions] = useAtom(contractVersionsAtom)
  const provider = useReadProvider()

  // React to changes to data
  useEffect(() => {
    if (!provider || !poolAddresses || !prizePoolType) return

    fetchPoolChainValues(
      provider,
      poolAddresses,
      prizePoolType,
      setPoolChainValues,
      contractVersions.prizeStrategy.contract,
      setErrorState
    )
  }, [provider, poolAddresses, prizePoolType])

  // Keep data up to date
  useInterval(() => {
    if (!provider || !poolAddresses || !prizePoolType) return

    fetchPoolChainValues(
      provider,
      poolAddresses,
      prizePoolType,
      setPoolChainValues,
      contractVersions.prizeStrategy.contract,
      setErrorState
    )
  }, DATA_REFRESH_POLLING_INTERVAL)

  return [poolChainValues, setPoolChainValues]
}

export const fetchPoolChainValues = async (
  provider,
  poolAddresses,
  prizePoolType,
  setPoolChainValues,
  prizeStrategyContract,
  setErrorState
) => {
  const { prizeStrategy, ticket, sponsorship, token, cToken, prizePool } = poolAddresses

  if (provider && prizeStrategy && ticket && sponsorship && prizePool) {
    try {
      const prizeStrategyRequests = getPrizeStrategyRequests(prizeStrategy, prizeStrategyContract)
      const etherplexTicketContract = contract('ticket', ERC20Abi, ticket)
      const etherplexSponsorshipContract = contract('sponsorship', ERC20Abi, sponsorship)
      const etherplexTokenContract = contract('token', ERC20Abi, token)
      const etherplexPrizePoolContract = contract('prizePool', PrizePoolAbi, prizePool)

      const batchRequests = [
        prizeStrategyRequests,
        etherplexTicketContract
          .name()
          .symbol()
          .totalSupply()
          .decimals(),
        etherplexSponsorshipContract
          .name()
          .symbol()
          .totalSupply(),
        etherplexTokenContract
          .decimals()
          .symbol()
          .name(),
        etherplexPrizePoolContract
          .captureAwardBalance()
          .creditPlanOf(ticket)
          .maxExitFeeMantissa()
          .maxTimelockDuration()
          .owner()
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
        canStartAward: values.prizeStrategy.canStartAward[0],
        canCompleteAward: values.prizeStrategy.canCompleteAward[0],
        externalErc20Awards: values.prizeStrategy.getExternalErc20Awards[0],
        externalErc721Awards: values.prizeStrategy.getExternalErc721Awards[0],
        supplyRatePerBlock: values?.cToken?.supplyRatePerBlock[0],
        isRngRequested: values.prizeStrategy.isRngRequested[0],
        isRngTimedOut: values.prizeStrategy.isRngTimedOut[0],
        prizePeriodRemainingSeconds: values.prizeStrategy.prizePeriodRemainingSeconds[0],
        numberOfWinners: values.prizeStrategy.numberOfWinners?.[0] || 1,
        sponsorshipName: values.sponsorship.name[0],
        sponsorshipSymbol: values.sponsorship.symbol[0],
        sponsorshipTotalSupply: values.sponsorship.totalSupply[0],
        ticketName: values.ticket.name[0],
        ticketSymbol: values.ticket.symbol[0],
        ticketDecimals: values.ticket.decimals[0],
        ticketTotalSupply: values.ticket.totalSupply[0],
        awardBalance: values.prizePool.captureAwardBalance[0],
        maxTimelockDuration: values.prizePool.maxTimelockDuration[0],
        ticketCreditRateMantissa: values.prizePool.creditPlanOf.creditRateMantissa,
        ticketCreditLimitMantissa: values.prizePool.creditPlanOf.creditLimitMantissa,
        maxExitFeeMantissa: values.prizePool.maxExitFeeMantissa[0],
        owner: values.prizePool.owner[0],
        poolTotalSupply,
        tokenDecimals: decimals,
        tokenSymbol: values.token.symbol[0],
        tokenName: values.token.name[0],
        tokenAddress: token,
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

const getPrizeStrategyRequests = (prizeStrategyAddress, contractType) => {
  switch (contractType) {
    case CONTRACTS.singleRandomWinner: {
      const etherplexPrizeStrategyContract = contract(
        'prizeStrategy',
        SingleRandomWinnerPrizeStrategyAbi,
        prizeStrategyAddress
      )
      return etherplexPrizeStrategyContract
        .isRngRequested() // used to determine if the pool is locked
        .isRngTimedOut()
        .canStartAward()
        .canCompleteAward()
        .prizePeriodRemainingSeconds()
        .getExternalErc20Awards()
        .getExternalErc721Awards()
    }
    case CONTRACTS.multipleWinners:
    default: {
      const etherplexPrizeStrategyContract = contract(
        'prizeStrategy',
        MultipleWinnersPrizeStrategyAbi,
        prizeStrategyAddress
      )
      return etherplexPrizeStrategyContract
        .isRngRequested()
        .isRngTimedOut()
        .canStartAward()
        .canCompleteAward()
        .prizePeriodRemainingSeconds()
        .getExternalErc20Awards()
        .getExternalErc721Awards()
        .numberOfWinners()
    }
  }
}
