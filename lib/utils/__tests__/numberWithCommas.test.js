import { getMinPrecision, numberWithCommas } from '../numberWithCommas'

describe('numberWithCommas', () => {
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
