import { normalizeTo18Decimals } from '../normalizeTo18Decimals'
import { ethers } from 'ethers'

const bn = ethers.utils.bigNumberify

describe('normalizeTo18Decimals', () => {
  it('should do nothing if the token contract is already in 18 decimals', () => {
    expect(
      normalizeTo18Decimals(
        bn('1000300000000000000000'),
        18
      )
    ).toEqual(
      bn('1000300000000000000000')
    )
  })

  it('should throw when decimals is higher than 18', () => {
    expect(() => normalizeTo18Decimals(
        bn('123456'),
        21
      )
    ).toThrow()
  })

  it('should add 12 zeroes if the erc20 token contract is set to 6 decimals', () => {
    expect(
      normalizeTo18Decimals(
        bn('123456'),
        6
      )
    ).toEqual(
      bn('123456000000000000')
    )
  })
})
