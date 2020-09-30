import { ethers } from 'ethers'
import { DEFAULT_TOKEN_PRECISION, SECONDS_PER_BLOCK } from '../constants'

import { normalizeTo18Decimals } from 'lib/utils/normalizeTo18Decimals'

const bn = ethers.utils.bigNumberify

export function calculateEstimatedPoolPrize({
  tokenDecimals,
  awardBalance,
  poolTotalSupply,
  supplyRatePerBlock,
  prizePeriodRemainingSeconds,
}) {
  const decimals = tokenDecimals || DEFAULT_TOKEN_PRECISION

  awardBalance = awardBalance || bn(0)
  awardBalance = normalizeTo18Decimals(awardBalance, decimals)

  poolTotalSupply = poolTotalSupply || bn(0)
  poolTotalSupply = normalizeTo18Decimals(poolTotalSupply, decimals)

  const supplyRatePerBlockBN = supplyRatePerBlock || bn(0)

  const prizePeriodRemainingSecondsBN = bn(prizePeriodRemainingSeconds || 0)
    .div(SECONDS_PER_BLOCK)

  const additionalYield = poolTotalSupply
    .mul(supplyRatePerBlockBN)
    .mul(prizePeriodRemainingSecondsBN)
    .div(ethers.constants.WeiPerEther)

  const estimatedPrizeBN = additionalYield.add(
    awardBalance
  )

  // denormalize back to original token decimal amount
  return estimatedPrizeBN
    .div(ethers.utils.parseUnits('1', 18 - parseInt(decimals, 10)))
}
