import { ethers } from 'ethers'

export const parseNumString = (amount, decimals) => {
  try {
    return amount ? ethers.utils.parseUnits(amount, decimals) : ethers.BigNumber.from(0)
  } catch (e) {
    console.warn(e)
  }
}
