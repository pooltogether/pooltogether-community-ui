import { ethers } from 'ethers'

export const parseNumString = (amount, decimals) => {
  try {
    return amount ? ethers.utils.parseUnits(amount, decimals) : ethers.constants.Zero
  } catch (e) {
    console.warn(e)
  }
}
