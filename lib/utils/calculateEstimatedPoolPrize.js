import { ethers } from 'ethers'
import { SECONDS_PER_BLOCK } from '../constants.jsx'

export function calculateEstimatedPoolPrize({awardBalance, poolTotalSupply, supplyRatePerBlock, prizePeriodRemainingSeconds}) {
  return ethers.utils.bigNumberify(poolTotalSupply || 0)
    .mul(ethers.utils.bigNumberify(supplyRatePerBlock || 0))
    .mul(ethers.utils.bigNumberify(prizePeriodRemainingSeconds || 0).div(SECONDS_PER_BLOCK))
    .div(ethers.constants.WeiPerEther)
    .add(awardBalance || 0)
}
