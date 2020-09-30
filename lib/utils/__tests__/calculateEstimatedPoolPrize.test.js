import { ethers } from 'ethers'

import { calculateEstimatedPoolPrize } from '../calculateEstimatedPoolPrize'

const bn = ethers.utils.bigNumberify

describe('calculateEstimatedPoolPrize', () => {

  it('returns 0 if loading data', () => {
    expect(
      calculateEstimatedPoolPrize({
        tokenDecimals: undefined,
        awardBalance: undefined,
        poolTotalSupply: undefined,
        supplyRatePerBlock: undefined,
        prizePeriodRemainingSeconds: undefined,
      })
    ).toEqual('0.0')
  })

  it('returns the correct estimate for a default 18 token precision set of contracts', () => {
    // defaults to 18 decimals
    const result = calculateEstimatedPoolPrize({
      awardBalance: ethers.utils.parseEther('200'),
      poolTotalSupply: ethers.utils.parseEther('5000000'),
      supplyRatePerBlock: bn('12345670123'),
      prizePeriodRemainingSeconds: bn('3600'),
    })

    expect(
      result.toString()
    ).toEqual('215864186108055000000.0')
  })

  it('returns the correct estimate for a default 18 token precision set of contracts', () => {
    const tokenDecimals = '6'
    const result = calculateEstimatedPoolPrize({
      tokenDecimals,
      awardBalance: ethers.utils.parseUnits('400', tokenDecimals),
      poolTotalSupply: ethers.utils.parseUnits('9000000', tokenDecimals),
      supplyRatePerBlock: bn('12345670123'),
      prizePeriodRemainingSeconds: bn('500'),
    })

    expect(
      result.toString()
    ).toEqual('403888886.088745')
  })

})
