import { ethers } from 'ethers'

export function calculateEstimatedPoolPrize(poolData) {
  const decimals = poolData.underlyingCollateralDecimals || '18'
  const totalSupply = poolData.totalSupply || '0'
  const totalSponsorship = poolData.totalSponsorship || '0'
  const supplyRatePerBlockBN = poolData.supplyRatePerBlock || ethers.utils.bigNumberify(0)
  const remainingBlocksBN = poolData.estimateRemainingBlocksToPrize || ethers.utils.bigNumberify(0)
  const awardBalanceBN = poolData.awardBalance || ethers.utils.bigNumberify(0)

  const supplyBN = ethers.utils.bigNumberify(totalSupply).add(
    ethers.utils.bigNumberify(totalSponsorship)
  )
  const supply = Number(ethers.utils.formatUnits(
    supplyBN,
    decimals
  ))

  const supplyRatePerBlock = Number(ethers.utils.formatUnits(
    supplyRatePerBlockBN,
    '18'
  ))

  const additionalYield = supply *
    supplyRatePerBlock *
    Number(remainingBlocksBN.toString())


  const awardBalance = Number(ethers.utils.formatUnits(awardBalanceBN, decimals))

  return additionalYield + awardBalance
}
