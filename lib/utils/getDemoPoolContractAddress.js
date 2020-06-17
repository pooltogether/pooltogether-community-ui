import { CONTRACT_ADDRESSES } from 'lib/constants'

export const getDemoPoolContractAddress = (networkName, ticker) => {
  let chainId = 1
  if (networkName === 'kovan') {
    chainId = 42
  }

  try {
    return CONTRACT_ADDRESSES[chainId][`${ticker.toUpperCase()}_PRIZE_POOL_CONTRACT_ADDRESS`]
  } catch (e) {
    console.warn('could not get pool address (no chainId?)')
    console.warn(e.message)
  }
}