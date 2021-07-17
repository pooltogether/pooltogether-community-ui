import { batch, contract } from '@pooltogether/etherplex'
import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'

export const fetchExitFee = async (
  provider,
  usersAddress,
  prizePoolAddress,
  ticketAddress,
  amount
) => {
  const exitFees = {
    earlyExitFee: null,
    credit: null,
    fetched: false
  }

  try {
    const etherplexPrizePoolContract = contract('prizePool', PrizePoolAbi, prizePoolAddress)

    const values = await batch(
      provider,
      etherplexPrizePoolContract
        .balanceOfCredit(usersAddress, ticketAddress)
        .calculateEarlyExitFee(usersAddress, ticketAddress, amount)
    )

    // Instant Withdrawal Credit/Fee
    exitFees.credit = values.prizePool.balanceOfCredit[0]
    exitFees.earlyExitFee = values.prizePool.calculateEarlyExitFee.exitFee
    exitFees.fetched = true
  } catch (e) {
    console.warn(e.message)
  } finally {
    return exitFees
  }
}
