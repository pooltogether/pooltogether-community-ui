import { ethers } from 'ethers'

export const isValidAddress = (address) => {
  if (!address) return false
  try {
    const checkSummedAddress = ethers.utils.getAddress(address)
    return Boolean(checkSummedAddress)
  } catch (e) {
    return false
  }
}
