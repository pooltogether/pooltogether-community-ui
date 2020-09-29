import { ethers } from 'ethers'
import { DEFAULT_TOKEN_PRECISION, SECONDS_PER_BLOCK } from '../constants'

export function calculateEstimatedPoolPrize({
  tokenDecimals,
  awardBalance,
  poolTotalSupply,
  supplyRatePerBlock,
  prizePeriodRemainingSeconds,
}) {
  const decimals = tokenDecimals || DEFAULT_TOKEN_PRECISION
  
  const awardBalanceBN = awardBalance || ethers.utils.bigNumberify(0)
  awardBalance = Number(ethers.utils.formatUnits(awardBalanceBN, decimals))

  poolTotalSupply = poolTotalSupply || '0'
  const supplyBN = ethers.utils.bigNumberify(poolTotalSupply)
  const supply = Number(ethers.utils.formatUnits(
    supplyBN,
    decimals
  ))

  supplyRatePerBlock = Number(ethers.utils.formatEther(supplyRatePerBlock || 0))
  
  prizePeriodRemainingSeconds = (Number(prizePeriodRemainingSeconds) || 0) / SECONDS_PER_BLOCK

  const additionalYield = supply *
    supplyRatePerBlock *
    prizePeriodRemainingSeconds
  

  return additionalYield + awardBalance
}
