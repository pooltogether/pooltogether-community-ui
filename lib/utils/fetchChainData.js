import { batch, contract } from '@pooltogether/etherplex'
import { ethers } from 'ethers'

import ERC20Abi from 'ERC20Abi'
import CTokenAbi from '@pooltogether/pooltogether-contracts/abis/CTokenInterface'
import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'
import CompoundPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/CompoundPrizePool'
import SingleRandomWinnerAbi from '@pooltogether/pooltogether-contracts/abis/SingleRandomWinner'

import { readProvider } from 'lib/utils/getReadProvider'

export const fetchPoolAddresses = async (
  provider,
  poolAddresses,
  setPoolAddresses,
) => {
  const {
    prizePool,
    ticket
  } = poolAddresses

  if (prizePool && !ticket) {
    try {

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
      const {
        token,
        cToken,
        prizeStrategy,
      } = poolValues.prizePool


      // Query Prize Strategy
      const etherplexPrizeStrategyContract = contract(
        'prizeStrategy',
        SingleRandomWinnerAbi,
        prizeStrategy[0]
      )
      const strategyValues = await batch(
        provider,
        etherplexPrizeStrategyContract
          // .governor()
          .rng()
          .sponsorship()
          .ticket()
      )
      const {
        // governor,
        rng,
        sponsorship,
        ticket,
      } = strategyValues.prizeStrategy


      // Update State
      setPoolAddresses(existingValues => ({
        ...existingValues,
        token: token[0],
        cToken: cToken[0],
        // governor: governor[0],
        prizeStrategy: prizeStrategy[0],
        rng: rng[0],
        sponsorship: sponsorship[0],
        ticket: ticket[0],
      }))

    } catch (e) {
      console.error(e)

      setPoolAddresses({
        error: true,
        errorMessage: e.message,
      })

      return
    }
  }
}

export const fetchGenericChainValues = async (
  provider,
  poolAddresses,
  setGenericChainValues,
) => {
  const {
    prizeStrategy,
    ticket,
    sponsorship,
    token,
    cToken,
    prizePool
  } = poolAddresses

  if (
    provider &&
    prizeStrategy &&
    ticket &&
    sponsorship &&
    prizePool
  ) {

    try {
      const etherplexPrizeStrategyContract = contract(
        'singleRandomWinner',
        SingleRandomWinnerAbi,
        prizeStrategy
      )
      const etherplexTicketContract = contract(
        'ticket',
        ERC20Abi,
        ticket
      )
      const etherplexSponsorshipContract = contract(
        'sponsorship',
        ERC20Abi,
        sponsorship
      )
      const etherplexTokenContract = contract(
        'token',
        ERC20Abi,
        token
      )
      const etherplexPrizePoolContract = contract(
        'prizePool',
        PrizePoolAbi,
        prizePool
      )
      const etherplexCTokenContract = contract(
        'cToken',
        CTokenAbi,
        cToken
      )

      const values = await batch(
        provider,
        etherplexPrizeStrategyContract
          .isRngRequested() // used to determine if the pool is locked
          .canStartAward()
          .canCompleteAward()
          .prizePeriodRemainingSeconds()
          .estimateRemainingBlocksToPrize(ethers.utils.parseEther('14')),
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
          .symbol(),
        etherplexPrizePoolContract
          .awardBalance()
          .creditPlanOf(ticket)
          .maxExitFeeMantissa(),
        etherplexCTokenContract
          .supplyRatePerBlock()
      )

      const poolTotalSupply = ethers.utils.bigNumberify(values.ticket.totalSupply[0]).add(values.sponsorship.totalSupply[0])

      let decimals = values.token.decimals[0]
      // default to 18 if the ERC20 contract returns 0 for decimals
      decimals = decimals === 0 ? 18 : decimals

      console.log({ awardBalance: values.prizePool.awardBalance })

      setGenericChainValues(existingValues => ({
        ...existingValues,
        canStartAward: values.singleRandomWinner.canStartAward[0],
        canCompleteAward: values.singleRandomWinner.canCompleteAward[0],
        estimateRemainingBlocksToPrize: values.singleRandomWinner.estimateRemainingBlocksToPrize[0],
        supplyRatePerBlock: values.cToken.supplyRatePerBlock[0],
        isRngRequested: values.singleRandomWinner.isRngRequested[0],
        prizePeriodRemainingSeconds: values.singleRandomWinner.prizePeriodRemainingSeconds[0],
        sponsorshipName: values.sponsorship.name,
        sponsorshipSymbol: values.sponsorship.symbol,
        sponsorshipTotalSupply: values.sponsorship.totalSupply[0],
        ticketName: values.ticket.name,
        ticketSymbol: values.ticket.symbol,
        ticketDecimals: values.ticket.decimals[0],
        ticketTotalSupply: values.ticket.totalSupply[0],
        awardBalance: values.prizePool.awardBalance[0],
        ticketCreditRateMantissa: values.prizePool.creditPlanOf.creditRateMantissa,
        ticketCreditLimitMantissa: values.prizePool.creditPlanOf.creditLimitMantissa,
        maxExitFeeMantissa: values.prizePool.maxExitFeeMantissa[0],
        poolTotalSupply: poolTotalSupply,
        tokenDecimals: decimals,
        tokenSymbol: values.token.symbol[0],
        loading: false,
      }))
    } catch (e) {

      setGenericChainValues({
        error: true,
        errorMessage: e.message,
      })

      console.warn(e.message)
      // console.error(e)
    }

  }
}

export const fetchUsersChainValues = async (
  provider,
  usersAddress,
  poolAddresses,
  setUsersChainValues,
) => {
  const {
    token,
    prizePool,
    ticket,
  } = poolAddresses

  if (
    token &&
    prizePool &&
    ticket
  ) {
    try {
      const etherplexPrizePoolContract = contract(
        'prizePool',
        CompoundPrizePoolAbi,
        prizePool
      )
      const etherplexTicketContract = contract(
        'ticket',
        ERC20Abi,
        ticket
      )
      const etherplexTokenContract = contract(
        'token',
        ERC20Abi,
        token
      )

      const values = await batch(
        provider,
        etherplexPrizePoolContract
          .timelockBalanceOf(usersAddress)
          .timelockBalanceAvailableAt(usersAddress),
        etherplexTicketContract
          .balanceOf(usersAddress),
        etherplexTokenContract
          .balanceOf(usersAddress)
          .allowance(usersAddress, prizePool)
      )

      setUsersChainValues(existingValues => ({
        ...existingValues,
        usersTicketBalance: values.ticket.balanceOf[0],
        usersTokenAllowance: values.token.allowance[0],
        usersTokenBalance: values.token.balanceOf[0],
        usersTimelockBalanceAvailableAt: values.prizePool.timelockBalanceAvailableAt[0],
        usersTimelockBalance: values.prizePool.timelockBalanceOf[0],
        loading: false,
      }))
    } catch (e) {
      setUsersChainValues({
        error: true,
        errorMessage: e.message,
      })

      console.warn(e.message)
    }

  }
}

export const fetchChainData = async (
  networkName,
  usersAddress,
  poolAddresses,
  setPoolAddresses,
  setGenericChainValues,
  setUsersChainValues,
) => {
  const provider = await readProvider(networkName)

  fetchPoolAddresses(provider, poolAddresses, setPoolAddresses)
  fetchGenericChainValues(provider, poolAddresses, setGenericChainValues)

  if (usersAddress) {
    fetchUsersChainValues(provider, usersAddress, poolAddresses, setUsersChainValues)
  }
}
