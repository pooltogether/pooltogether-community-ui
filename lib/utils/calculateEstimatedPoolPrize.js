import { ethers } from 'ethers'
import { SECONDS_PER_BLOCK } from '../constants.jsx'

export function calculateEstimatedPoolPrize({
  awardBalance,
  poolTotalSupply,
  supplyRatePerBlock,
  prizePeriodRemainingSeconds,
  tokenDecimals
}) {
  const decimals = tokenDecimals || '18'
  poolTotalSupply = poolTotalSupply || '0'

  const prizePeriodRemainingSeconds = (Number(prizePeriodRemainingSeconds) || 0) / SECONDS_PER_BLOCK
  const supplyRatePerBlock = Number(ethers.utils.formatEther(supplyRatePerBlock || 0))
  const awardBalanceBN = awardBalance || ethers.utils.bigNumberify(0)

  const supplyBN = ethers.utils.bigNumberify(poolTotalSupply)
  const supply = Number(ethers.utils.formatUnits(
    supplyBN,
    decimals
  ))

  const additionalYield = supply *
    supplyRatePerBlock *
    prizePeriodRemainingSeconds

  const awardBalance = Number(ethers.utils.formatUnits(awardBalanceBN, decimals))

  return additionalYield + awardBalance
}
