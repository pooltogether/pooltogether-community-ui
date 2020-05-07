import { batch, contract } from '@pooltogether/etherplex'

import ERC20Abi from '@pooltogether/pooltogether-contracts/abis/ERC20'
import InterestPoolAbi from '@pooltogether/pooltogether-contracts/abis/InterestPoolInterface'
import PeriodicPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PeriodicPrizePool'
import TicketAbi from '@pooltogether/pooltogether-contracts/abis/Ticket'

import { getPoolContractAddress } from 'lib/utils/getPoolContractAddress'

export const getPoolAddresses = async (walletContext, poolAddresses, setPoolAddresses) => {
  const usersAddress = walletContext.state.address
  const provider = walletContext.state.provider
  const poolContractAddress = getPoolContractAddress(walletContext)

  if (usersAddress && provider && poolContractAddress && !poolAddresses.ticketAddress) {
    // console.log("running getPoolAddresses")
    const etherplexPoolContract = contract(
      'pool',
      PeriodicPrizePoolAbi,
      poolContractAddress
    )

    const poolValues = await batch(
      provider,
      etherplexPoolContract
        .interestPool()
        .ticket()
        .sponsorship()
        .prizeStrategy()
    )

    const {
      interestPool,
      ticket,
      sponsorship,
      prizeStrategy,
    } = poolValues.pool

    const etherplexInterestPoolContract = contract(
      'interestPool',
      InterestPoolAbi,
      interestPool[0]
    )

    const interestPoolValues = await batch(
      provider,
      etherplexInterestPoolContract
        .token(),
    )

    const erc20ContractAddress = interestPoolValues.interestPool.token[0]

    setPoolAddresses(existingValues => ({
      ...existingValues,
      interestPoolAddress: interestPool[0],
      ticketAddress: ticket[0],
      sponsorshipAddress: sponsorship[0],
      prizeStrategyAddress: prizeStrategy[0],
      erc20ContractAddress,
    }))
  } else {
    // console.warn('no userAddress, provider, or poolAddress/chainId?')
  }
}

export const getChainValues = async (walletContext, poolAddresses, chainValues, setChainValues) => {
  const usersAddress = walletContext.state.address
  const provider = walletContext.state.provider
  const poolContractAddress = getPoolContractAddress(walletContext)

  if (
    provider &&
    poolContractAddress &&
    poolAddresses.ticketAddress
  ) {
    const {
      interestPoolAddress,
      ticketAddress,
    } = poolAddresses

    // console.log('running getChainValues')
    try {
      if (interestPoolAddress && ticketAddress) {
        const etherplexPoolContract = contract(
          'pool',
          PeriodicPrizePoolAbi,
          poolContractAddress
        )
        const etherplexTicketContract = contract(
          'ticket',
          TicketAbi,
          ticketAddress
        )

        const values = await batch(
          provider,
          etherplexPoolContract
            .canAward()
            .remainingSecondsToPrize(),
          etherplexTicketContract
            .balanceOf(usersAddress)
            .totalSupply()
        )



        const etherplexERC20Contract = contract(
          'erc20',
          ERC20Abi,
          poolAddresses.erc20ContractAddress
        )

        const erc20Values = await batch(
          provider,
          etherplexERC20Contract
            .balanceOf(usersAddress)
            .allowance(usersAddress, poolContractAddress)
            .symbol()
        )

        setChainValues(existingValues => ({
          ...existingValues,
          canAward: values.pool.canAward[0],
          remainingSecondsToPrize: values.pool.remainingSecondsToPrize[0],
          usersTicketBalance: values.ticket.balanceOf[0],
          usersERC20Allowance: erc20Values.erc20.allowance[0],
          usersERC20Balance: erc20Values.erc20.balanceOf[0],
          // erc20Name: erc20Values.erc20.name[0],
          erc20Symbol: erc20Values.erc20.symbol[0],
          loading: false,
        }))
      }
    } catch (e) {
      console.warn(e.message)
      // console.error(e)
    }

  } else {
    // console.warn('no userAddress, provider, or poolAddress/chainId?')
  }
}
