import { ethers } from 'ethers'

import { getMinPrecision, numberWithCommas } from '../numberWithCommas'

const bn = ethers.BigNumber.from

describe('numberWithCommas', () => {
  it('has appropriate amount of trailing decimals places', () => {
    expect(numberWithCommas(bn('3500'), { decimals: 8 })).toEqual('0.000035')
  })

  it('has at least two decimal places', () => {
    expect(numberWithCommas(bn('1000300000000000000000'))).toEqual('1,000.30')
  })

  it('has no decimal places', () => {
    expect(numberWithCommas(bn('1000300000000000000000000'))).toEqual('1,000,300')
  })

  it('should show two decimal points by default', () => {
    expect(numberWithCommas('1937.123432')).toEqual('1,937.12')
  })

  it('should show no decimal points with precision set', () => {
    expect(
      numberWithCommas('100000.154', {
        precision: 0
      })
    ).toEqual('100,000')
  })

  it('should 5 decimal points with options', () => {
    expect(
      numberWithCommas('103.456724', {
        precision: 5
      })
    ).toEqual('103.45672')
  })
})

describe('getMinPrecision', () => {
  it('should return 6 decimal places of precision', () => {
    expect(getMinPrecision(10.00005)).toEqual(6)
  })

  it('should return 8 decimal places of precision', () => {
    expect(
      getMinPrecision(10.00005, {
        additionalDigits: 4
      })
    ).toEqual(8)
  })

  it('should return default decimal places of precision', () => {
    expect(getMinPrecision(10)).toEqual(2)
  })
})
