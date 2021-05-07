import { ethers } from 'ethers'

export const isValidAddress = (address) => {
  if (!address) return

  try {
    ethers.utils.getAddress(address)
  } catch (e) {
    console.error(e)

    if (e.message.match('invalid address')) {
      return false
    }
  }
  return true
}
