import { ethers } from 'ethers'
import { amountWithCommas } from '../format'

const bn = ethers.BigNumber.from

describe('format', () => {
  describe('amountWithCommas', () => {
    it('has appropriate amount of trailing decimals places', () => {
      expect(amountWithCommas(bn('3500'), 8)).toEqual('0.000035')
    })

    it('has at least two decimal places', () => {
      expect(amountWithCommas(bn('1000300000000000000000'), 18)).toEqual('1,000.30')
    })

    it('has no decimal places', () => {
      expect(amountWithCommas(bn('1000300000000000000000000'), 18)).toEqual('1,000,300')
    })
  })
})
