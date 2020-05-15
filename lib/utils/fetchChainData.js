import { batch, contract } from '@pooltogether/etherplex'
import { ethers } from 'ethers'

import ERC20Abi from '@pooltogether/pooltogether-contracts/abis/ERC20'
import YieldServiceAbi from '@pooltogether/pooltogether-contracts/abis/YieldServiceInterface'
import PeriodicPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PeriodicPrizePool'
import TicketAbi from '@pooltogether/pooltogether-contracts/abis/Ticket'
import ControllerTokenAbi from '@pooltogether/pooltogether-contracts/abis/ControlledToken'

import { readProvider } from 'lib/utils/getReadProvider'

export const fetchPoolAddresses = async (
  provider,
  poolAddresses,
  setPoolAddresses,
) => {  
  const {
    pool,
    ticket
  } = poolAddresses

  if (pool && !ticket) {
    const etherplexPoolContract = contract(
      'pool',
      PeriodicPrizePoolAbi,
      pool
    )

    let poolValues = {}
    try {
      poolValues = await batch(
        provider,
        etherplexPoolContract
          .yieldService()
          .ticket()
          .timelock()
          .sponsorship()
          .prizeStrategy()
      )
    } catch (e) {
      console.error(e)
      setPoolAddresses({
        error: true,
        errorMessage: e.message,
      })
      return
    }

    const {
      yieldService,
      ticket,
      timelock,
      sponsorship,
      prizeStrategy,
    } = poolValues.pool

    const etherplexYieldServiceContract = contract(
      'yieldService',
      YieldServiceAbi,
      yieldService[0]
    )

    const yieldServiceValues = await batch(
      provider,
      etherplexYieldServiceContract
        .token(),
    )

    const erc20 = yieldServiceValues.yieldService.token[0]

    setPoolAddresses(existingValues => ({
      ...existingValues,
      yieldService: yieldService[0],
      ticket: ticket[0],
      timelock: timelock[0],
      sponsorship: sponsorship[0],
      prizeStrategy: prizeStrategy[0],
      erc20,
    }))
  }
}

export const fetchGenericChainValues = async (
  provider,
  poolAddresses,
  setChainValues,
) => {
  const {
    yieldService,
    pool,
    ticket,
    sponsorship,
  } = poolAddresses

  if (
    provider &&
    pool &&
    yieldService &&
    ticket
  ) {
    try {
      const etherplexPoolContract = contract(
        'pool',
        PeriodicPrizePoolAbi,
        pool
      )
      const etherplexTicketContract = contract(
        'ticket',
        TicketAbi,
        ticket
      )
      const etherplexSponsorshipContract = contract(
        'sponsorship',
        ControllerTokenAbi,
        sponsorship
      )
      const etherplexERC20Contract = contract(
        'erc20',
        ERC20Abi,
        poolAddresses.erc20
      )

      const values = await batch(
        provider,
        etherplexPoolContract
          .isRngRequested() // used to determine if the pool is locked
          .canStartAward()
          .canCompleteAward()
          .remainingSecondsToPrize()
          .estimatePrize(ethers.utils.bigNumberify(13)),
        etherplexTicketContract
          .name()
          .symbol()
          .totalSupply(),
        etherplexSponsorshipContract
          .name()
          .symbol()
          .totalSupply(),
        etherplexERC20Contract
          .decimals()
          .symbol()
      )
      
      setChainValues(existingValues => ({
        ...existingValues,
        canStartAward: values.pool.canStartAward[0],
        canCompleteAward: values.pool.canCompleteAward[0],
        estimatePrize: values.pool.estimatePrize[0],
        isRngRequested: values.pool.isRngRequested[0],
        remainingSecondsToPrize: values.pool.remainingSecondsToPrize[0],
        sponsorshipName: values.sponsorship.name,
        sponsorshipSymbol: values.sponsorship.symbol,
        sponsorshipTotalSupply: values.sponsorship.totalSupply,
        ticketName: values.ticket.name,
        ticketSymbol: values.ticket.symbol,
        ticketTotalSupply: values.ticket.totalSupply,
        erc20Decimals: values.erc20.decimals[0],
        erc20Symbol: values.erc20.symbol[0],
        loading: false,
      }))
    } catch (e) {
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
    yieldService,
    pool,
    ticket,
    timelock,
  } = poolAddresses

  if (
    pool &&
    yieldService &&
    timelock &&
    ticket
  ) {
    try {
      const etherplexPoolContract = contract(
        'pool',
        PeriodicPrizePoolAbi,
        pool
      )
      const etherplexTicketContract = contract(
        'ticket',
        TicketAbi,
        ticket
      )
      const etherplexTimelockContract = contract(
        'timelock',
        ControllerTokenAbi,
        timelock
      )
      const etherplexERC20Contract = contract(
        'erc20',
        ERC20Abi,
        poolAddresses.erc20
      )

      const values = await batch(
        provider,
        // etherplexPoolContract
        //   .timelockBalanceAvailableAt(usersAddress),
        etherplexTicketContract
          .balanceOf(usersAddress),
        etherplexTimelockContract
          .balanceOf(usersAddress),
        etherplexERC20Contract
          .balanceOf(usersAddress)
          .allowance(usersAddress, pool)
      )

      setUsersChainValues(existingValues => ({
        ...existingValues,
        usersTicketBalance: values.ticket.balanceOf[0],
        usersERC20Allowance: values.erc20.allowance[0],
        usersERC20Balance: values.erc20.balanceOf[0],
        usersTimelockBalance: values.timelock.balanceOf[0],
        // usersTimelockBalanceAvailableAt: values.pool.timelockBalanceAvailableAt[0],
        loading: false,
      }))
    } catch (e) {
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
