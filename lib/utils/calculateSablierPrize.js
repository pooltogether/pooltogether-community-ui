import { ethers } from 'ethers'
import { secondsSinceEpoch } from 'lib/utils/secondsSinceEpoch'

// Edge cases:
// If the stream gets cancelled: then the streamed amount is never claimed
// Stream changes: old stream doesn't get claimed, new stream will go through
// this function
// Historic prizes: are captured in the awarded prize amount, so reading from Sablier
// isn't necessary

export const calculateSablierPrize = (sablierData, prizeStrategyData) => {
  const { startTime, stopTime, ratePerSecond } = sablierData
  const { prizePeriodStartedAt, prizePeriodSeconds, isRngRequested } = prizeStrategyData
  const prizePeriodEndsAt = prizePeriodStartedAt.add(prizePeriodSeconds)
  const currentTime = ethers.BigNumber.from(secondsSinceEpoch())

  // Stream hasn't started yet
  if (prizePeriodEndsAt.lt(startTime)) {
    return {
      amountThisPrizePeriod: ethers.constants.Zero,
      amountPerPrizePeriod: ethers.constants.Zero
    }
  }

  const streamEndsAfterPrizePeriod = stopTime.gt(prizePeriodEndsAt)
  const prizePeriodFinished = currentTime.gt(prizePeriodEndsAt)
  const streamStartedAfterPrizePool = startTime.gte(prizePeriodStartedAt)

  let dripEnd
  // If people take too long to award the prize, the stream will be added to that earlier prize
  if (streamEndsAfterPrizePeriod && prizePeriodFinished && !isRngRequested) {
    const streamHasEnded = stopTime.lte(currentTime)
    dripEnd = streamHasEnded ? stopTime : currentTime
  } else {
    const streamHasEnded = stopTime.lte(prizePeriodEndsAt)
    dripEnd = streamHasEnded ? stopTime : prizePeriodEndsAt
  }
  const dripStart = streamStartedAfterPrizePool ? startTime : prizePeriodStartedAt
  const dripTime = dripEnd.sub(dripStart)
  const amountThisPrizePeriod = dripTime.mul(ratePerSecond)

  const amountPerPrizePeriod = prizePeriodSeconds.mul(ratePerSecond)

  return { amountThisPrizePeriod, amountPerPrizePeriod }
}
