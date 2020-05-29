import { batch, contract } from '@pooltogether/etherplex'
// import { ethers } from 'ethers'

import ERC20Abi from 'ERC20Abi'
// import ControllerTokenAbi from '@pooltogether/pooltogether-contracts/abis/ControlledToken'
// import OwnableModuleManagerAbi from '@pooltogether/pooltogether-contracts/abis/OwnableModuleManagerAbi'
import PeriodicPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PeriodicPrizePool'
import PrizePoolModuleManager from '@pooltogether/pooltogether-contracts/abis/PrizePoolModuleManager'
import LoyaltyAbi from '@pooltogether/pooltogether-contracts/abis/Loyalty'
import TicketAbi from '@pooltogether/pooltogether-contracts/abis/Ticket'
import TimelockAbi from '@pooltogether/pooltogether-contracts/abis/Timelock'
import SponsorshipAbi from '@pooltogether/pooltogether-contracts/abis/Sponsorship'
import YieldServiceAbi from '@pooltogether/pooltogether-contracts/abis/YieldServiceInterface'

import { readProvider } from 'lib/utils/getReadProvider'

export const fetchPoolAddresses = async (
  provider,
  poolAddresses,
  setPoolAddresses,
) => {  
  const {
    poolManager,
    ticket
  } = poolAddresses

  if (poolManager && !ticket) {
    try {
      const etherplexPoolManagerContract = contract(
        'poolManager',
        PrizePoolModuleManager,
        poolManager
      )

      const poolValues = await batch(
        provider,
        etherplexPoolManagerContract
          .prizePool()
          .loyalty()
          .sponsorship()
          .ticket()
          .timelock()
          .yieldService()
          // .prizeStrategy()
      )
      // 0x74E9Fb436C558a00fc77A0fEF41CE26aB3e923F2

      const {
        prizePool,
        loyalty,
        sponsorship,
        ticket,
        timelock,
        yieldService,
        // prizeStrategy,
      } = poolValues.poolManager

      const etherplexYieldServiceContract = contract(
        'yieldService',
        YieldServiceAbi,
        yieldService[0],
      )

      const etherplexPrizePoolContract = contract(
        'prizePool',
        PeriodicPrizePoolAbi,
        prizePool[0]
      )

      const childContractValues = await batch(
        provider,
        etherplexYieldServiceContract
          .token(),
        etherplexPrizePoolContract
          // .governor()
          .prizeStrategy()
          .rng()
      )

      const erc20 = childContractValues.yieldService.token[0]
      
      // const governor = childContractValues.childContractValues.governor[0]
      const prizeStrategy = childContractValues.prizePool.prizeStrategy[0]
      const rng = childContractValues.prizePool.rng[0]

      setPoolAddresses(existingValues => ({
        ...existingValues,
        erc20,
        // governor,
        prizeStrategy,
        rng,
        loyalty: loyalty[0],
        prizePool: prizePool[0],
        sponsorship: sponsorship[0],
        ticket: ticket[0],
        timelock: timelock[0],
        yieldService: yieldService[0],
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
  setChainValues,
) => {
  const {
    yieldService,
    prizePool,
    ticket,
    sponsorship,
  } = poolAddresses

  if (
    provider &&
    prizePool &&
    yieldService &&
    ticket
  ) {
    try {
      const etherplexPrizePoolContract = contract(
        'prizePool',
        PeriodicPrizePoolAbi,
        prizePool
      )
      const etherplexTicketContract = contract(
        'ticket',
        TicketAbi,
        ticket
      )
      const etherplexSponsorshipContract = contract(
        'sponsorship',
        SponsorshipAbi,
        sponsorship
      )
      const etherplexERC20Contract = contract(
        'erc20',
        ERC20Abi,
        poolAddresses.erc20
      )

      const values = await batch(
        provider,
        etherplexPrizePoolContract
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
        etherplexERC20Contract
          .decimals()
          .symbol(),
      )

      let decimals = values.erc20.decimals[0]
      // default to 18 if the ERC20 contract returns 0 for decimals
      decimals = decimals === 0 ? 18 : decimals

      setChainValues(existingValues => ({
        ...existingValues,
        canStartAward: values.prizePool.canStartAward[0],
        canCompleteAward: values.prizePool.canCompleteAward[0],
        estimateRemainingPrize: values.prizePool.estimateRemainingPrize[0],
        isRngRequested: values.prizePool.isRngRequested[0],
        prizePeriodRemainingSeconds: values.prizePool.prizePeriodRemainingSeconds[0],
        sponsorshipName: values.sponsorship.name,
        sponsorshipSymbol: values.sponsorship.symbol,
        sponsorshipTotalSupply: values.sponsorship.totalSupply,
        ticketName: values.ticket.name,
        ticketSymbol: values.ticket.symbol,
        ticketTotalSupply: values.ticket.totalSupply,
        erc20Decimals: decimals,
        erc20Symbol: values.erc20.symbol[0],
        loading: false,
      }))
    } catch (e) {
      
      setChainValues({
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
    yieldService,
    prizePool,
    ticket,
    timelock,
  } = poolAddresses

  if (
    prizePool &&
    yieldService &&
    timelock &&
    ticket
  ) {
    try {
      const etherplexPrizePoolContract = contract(
        'prizePool',
        PeriodicPrizePoolAbi,
        prizePool
      )
      const etherplexTicketContract = contract(
        'ticket',
        TicketAbi,
        ticket
      )
      const etherplexTimelockContract = contract(
        'timelock',
        TimelockAbi,
        timelock
      )
      const etherplexERC20Contract = contract(
        'erc20',
        ERC20Abi,
        poolAddresses.erc20
      )

      const values = await batch(
        provider,
        // etherplexPrizePoolContract
        //   .timelockBalanceAvailableAt(usersAddress),
        etherplexTicketContract
          .balanceOf(usersAddress),
        etherplexTimelockContract
          .balanceOf(usersAddress),
        etherplexERC20Contract
          .balanceOf(usersAddress)
          .allowance(usersAddress, ticket)
      )

      setUsersChainValues(existingValues => ({
        ...existingValues,
        usersTicketBalance: values.ticket.balanceOf[0],
        usersERC20Allowance: values.erc20.allowance[0],
        usersERC20Balance: values.erc20.balanceOf[0],
        usersTimelockBalance: values.timelock.balanceOf[0],
        // usersTimelockBalanceAvailableAt: values.prizePool.timelockBalanceAvailableAt[0],
        loading: false,
      }))
    } catch (e) {
      setGenericChainValues({
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
