import { ethers } from 'ethers'
import { batch, contract } from '@pooltogether/etherplex'

import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'

import { readProvider } from 'lib/utils/getReadProvider'

export const fetchExitFee = async (
  networkName,
  usersAddress,
  prizePoolAddress,
  ticketAddress,
  amount,
) => {
  const provider = await readProvider(networkName)
  const exitFees = {
    credit       : ethers.utils.bigNumberify(0),
    earlyExitFee : ethers.utils.bigNumberify(0),
  }

  try {
    const etherplexPrizePoolContract = contract(
      'prizePool',
      PrizePoolAbi,
      prizePoolAddress
    )

    const values = await batch(
      provider,
      etherplexPrizePoolContract
        .balanceOfCredit(usersAddress, ticketAddress)
        .calculateEarlyExitFee(ticketAddress, amount.div(1000000000000))
    )

    // Instant Withdrawal Credit/Fee
    exitFees.credit = values.prizePool.balanceOfCredit[0]
    exitFees.earlyExitFee = values.prizePool.calculateEarlyExitFee[0]
    console.log(exitFees.credit.toString())
  }
  catch (e) {
    console.warn(e.message)
  }
  finally {
    return exitFees
  }
}
