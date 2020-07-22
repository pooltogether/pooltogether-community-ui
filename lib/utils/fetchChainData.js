import { batch, contract } from '@pooltogether/etherplex'

import ERC20Abi from 'ERC20Abi'
import CompoundPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/CompoundPrizePool'
import PrizeStrategyAbi from '@pooltogether/pooltogether-contracts/abis/PrizeStrategy'
// import ControlledTokenAbi from '@pooltogether/pooltogether-contracts/abis/ControlledToken'

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
          .prizeStrategy()
      )
      const {
        token,
        prizeStrategy,
      } = poolValues.prizePool


      // Query Prize Strategy
      const etherplexPrizeStrategyContract = contract(
        'prizeStrategy',
        PrizeStrategyAbi,
        prizeStrategy[0]
      )
      const strategyValues = await batch(
        provider,
        etherplexPrizeStrategyContract
          .governor()
          .rng()
          .sponsorship()
          .ticket()
      )
      const {
        governor,
        rng,
        sponsorship,
        ticket,
      } = strategyValues.prizeStrategy

      // console.log({poolValues})


      // Update State
      setPoolAddresses(existingValues => ({
        ...existingValues,
        token: token[0],
        governor: governor[0],
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
  } = poolAddresses

  if (
    provider &&
    prizeStrategy &&
    ticket &&
    sponsorship
  ) {
    try {
      const etherplexPrizeStrategyContract = contract(
        'prizeStrategy',
        PrizeStrategyAbi,
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

      const values = await batch(
        provider,
        etherplexPrizeStrategyContract
          .isRngRequested() // used to determine if the pool is locked
          .canStartAward()
          .canCompleteAward()
          .prizePeriodRemainingSeconds()
          .estimateRemainingPrize(),
        etherplexTicketContract
          .name()
          .symbol()
          .totalSupply(),
        etherplexSponsorshipContract
          .name()
          .symbol()
          .totalSupply(),
        etherplexTokenContract
          .decimals()
          .symbol(),
      )

      let decimals = values.token.decimals[0]
      // default to 18 if the ERC20 contract returns 0 for decimals
      decimals = decimals === 0 ? 18 : decimals


      // console.log({values})


      setGenericChainValues(existingValues => ({
        ...existingValues,
        canStartAward: values.prizeStrategy.canStartAward[0],
        canCompleteAward: values.prizeStrategy.canCompleteAward[0],
        estimateRemainingPrize: values.prizeStrategy.estimateRemainingPrize[0],
        isRngRequested: values.prizeStrategy.isRngRequested[0],
        prizePeriodRemainingSeconds: values.prizeStrategy.prizePeriodRemainingSeconds[0],
        sponsorshipName: values.sponsorship.name,
        sponsorshipSymbol: values.sponsorship.symbol,
        sponsorshipTotalSupply: values.sponsorship.totalSupply,
        ticketName: values.ticket.name,
        ticketSymbol: values.ticket.symbol,
        ticketTotalSupply: values.ticket.totalSupply,
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

      // console.log({token, usersAddress, values})

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
