import { ethers } from 'ethers'

export const calculateOdds = (
  usersTicketBalance,
  totalSupply,
  ticketDecimals,
  numberOfWinners = 1
) => {
  if (usersTicketBalance.eq(ethers.utils.bigNumberify(0))) {
    return 0
  }

  const usersBalanceFloat = Number(
    ethers.utils.formatUnits(usersTicketBalance, Number(ticketDecimals))
  )

  const totalSupplyFloat = Number(ethers.utils.formatUnits(totalSupply, Number(ticketDecimals)))

  return totalSupplyFloat / usersBalanceFloat / numberOfWinners
}
