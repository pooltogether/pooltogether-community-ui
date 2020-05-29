import { batch, contract } from '@pooltogether/etherplex'

import PeriodicPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PeriodicPrizePool'

import { readProvider } from 'lib/utils/getReadProvider'

export const fetchExitFee = async (
  networkName,
  usersAddress,
  prizePoolAddress,
  tickets,
) => {
  const provider = await readProvider(networkName)

  try {
    const etherplexPoolContract = contract(
      'pool',
      PeriodicPrizePoolAbi,
      prizePoolAddress
    )

    const values = await batch(
      provider,
      etherplexPoolContract
        .calculateExitFee(usersAddress, tickets)
        // .calculateUnlockTimestamp(usersAddress)
    )

    return {
      exitFee: values.pool.calculateExitFee[0]
    }
  } catch (e) {
    console.warn(e.message)
  }
}
