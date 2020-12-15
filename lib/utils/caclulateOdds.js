import { ethers } from 'ethers'

export const caclulateOdds = (usersTicketBalance, totalSupply, ticketDecimals) => {
  const usersBalanceFloat = Number(
    ethers.utils.formatUnits(usersTicketBalance, Number(ticketDecimals))
  )

  const totalSupplyFloat = Number(ethers.utils.formatUnits(totalSupply, Number(ticketDecimals)))

  console.log(
    usersTicketBalance.toString(),
    totalSupply.toString(),
    ticketDecimals,
    usersBalanceFloat,
    totalSupplyFloat,
    usersBalanceFloat / totalSupplyFloat
  )

  return totalSupplyFloat / usersBalanceFloat
}
