import { batch, contract } from '@pooltogether/etherplex'

import ERC20Abi from '@pooltogether/pooltogether-contracts/abis/ERC20'
import YieldServiceAbi from '@pooltogether/pooltogether-contracts/abis/YieldServiceInterface'
import PeriodicPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PeriodicPrizePool'
import TicketAbi from '@pooltogether/pooltogether-contracts/abis/Ticket'

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

    const poolValues = await batch(
      provider,
      etherplexPoolContract
        .yieldService()
        .ticket()
        .sponsorship()
        .prizeStrategy()
    )

    const {
      yieldService,
      ticket,
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

      const values = await batch(
        provider,
        etherplexPoolContract
          .canStartAward()
          .remainingSecondsToPrize(),
        etherplexTicketContract
          .totalSupply()
      )

      const etherplexERC20Contract = contract(
        'erc20',
        ERC20Abi,
        poolAddresses.erc20
      )

      const erc20Values = await batch(
        provider,
        etherplexERC20Contract
          // .name()
          .decimals()
          .symbol()
      )

      setChainValues(existingValues => ({
        ...existingValues,
        canAward: values.pool.canStartAward[0],
        remainingSecondsToPrize: values.pool.remainingSecondsToPrize[0],
        erc20Decimals: erc20Values.erc20.decimals[0],
        // erc20Name: erc20Values.erc20.name[0],
        erc20Symbol: erc20Values.erc20.symbol[0],
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
    interestPool,
    pool,
    ticket,
  } = poolAddresses

  if (
    pool &&
    interestPool &&
    ticket
  ) {
    try {
      const etherplexTicketContract = contract(
        'ticket',
        TicketAbi,
        ticket
      )

      const values = await batch(
        provider,
        etherplexTicketContract
          .balanceOf(usersAddress)
      )

      
      const etherplexERC20Contract = contract(
        'erc20',
        ERC20Abi,
        poolAddresses.erc20
      )

      const erc20Values = await batch(
        provider,
        etherplexERC20Contract
          .balanceOf(usersAddress)
          .allowance(usersAddress, pool)
      )

      setUsersChainValues(existingValues => ({
        ...existingValues,
        usersTicketBalance: values.ticket.balanceOf[0],
        usersERC20Allowance: erc20Values.erc20.allowance[0],
        usersERC20Balance: erc20Values.erc20.balanceOf[0],
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