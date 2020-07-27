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

  try {
    const etherplexStrategyContract = contract(
      'prizeStrategy',
      PrizeStrategyAbi,
      prizeStrategyAddress
    )

    // console.log({usersAddress, tickets, ticketAddress, etherplexStrategyContract})

    const values = await batch(
      provider,
      etherplexStrategyContract
        .calculateInstantWithdrawalFee(usersAddress, tickets, ticketAddress)
        .calculateTimelockDurationAndFee(usersAddress, tickets, ticketAddress)
    )

    return {
      instantWithdrawalFee: {
        burnedCredit: values.prizeStrategy.calculateInstantWithdrawalFee.burnedCredit,
        remainingFee: values.prizeStrategy.calculateInstantWithdrawalFee.remainingFee,
      },
      timelockDurationAndFee: {
        burnedCredit: values.prizeStrategy.calculateTimelockDurationAndFee.burnedCredit,
        durationSeconds: values.prizeStrategy.calculateTimelockDurationAndFee.durationSeconds,
      },
    }
  } catch (e) {
    console.warn(e.message)
    return {}
  }
}
