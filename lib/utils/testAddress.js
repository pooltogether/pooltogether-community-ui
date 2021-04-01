import { ethers } from 'ethers'

export const testAddress = (address) => {
  if (!address) {
    return
  }

  let addressError

  try {
    ethers.utils.getAddress(address)
  } catch (e) {
    console.error(e)

    if (e.message.match('invalid address')) {
      addressError = true
    }
  }

  return addressError
}
