import { ethers } from 'ethers'

export const caclulateOdds = (usersTicketBalance, totalSupply, ticketDecimals) => {
  if (usersTicketBalance.eq(ethers.utils.bigNumberify(0))) {
    return 0
  }

  const usersBalanceFloat = Number(
    ethers.utils.formatUnits(usersTicketBalance, Number(ticketDecimals))
  )

  const totalSupplyFloat = Number(ethers.utils.formatUnits(totalSupply, Number(ticketDecimals)))

  return totalSupplyFloat / usersBalanceFloat
}
