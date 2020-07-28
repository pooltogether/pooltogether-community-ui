import { ethers } from 'ethers'
import { batch, contract } from '@pooltogether/etherplex'

import PrizeStrategyAbi from '@pooltogether/pooltogether-contracts/abis/PrizeStrategy'

import { readProvider } from 'lib/utils/getReadProvider'

export const fetchExitFee = async (
  networkName,
  usersAddress,
  prizeStrategyAddress,
  ticketAddress,
  tickets,
) => {
  const provider = await readProvider(networkName)
  const exitFees = {
    instantCredit    : ethers.utils.bigNumberify(0),
    instantFee       : ethers.utils.bigNumberify(0),
    timelockCredit   : ethers.utils.bigNumberify(0),
    timelockDuration : ethers.utils.bigNumberify(0),
  }

  try {
    const etherplexStrategyContract = contract(
      'prizeStrategy',
      PrizeStrategyAbi,
      prizeStrategyAddress
    )

    const values = await batch(
      provider,
      etherplexStrategyContract
        .calculateInstantWithdrawalFee(usersAddress, tickets, ticketAddress)
        .calculateTimelockDurationAndFee(usersAddress, tickets, ticketAddress)
    )

    // Instant Withdrawal Credit/Fee
    exitFees.instantCredit = values.prizeStrategy.calculateInstantWithdrawalFee.burnedCredit
    exitFees.instantFee = values.prizeStrategy.calculateInstantWithdrawalFee.remainingFee

    // Scheduled Withdrawal Credit/Duration
    exitFees.timelockCredit = values.prizeStrategy.calculateTimelockDurationAndFee.burnedCredit
    exitFees.timelockDuration = values.prizeStrategy.calculateTimelockDurationAndFee.durationSeconds
  }
  catch (e) {
    console.warn(e.message)
  }
  finally {
    return exitFees
  }
}
