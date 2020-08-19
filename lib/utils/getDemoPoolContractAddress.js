import { CONTRACT_ADDRESSES } from 'lib/constants'
import nameToChainId from './nameToChainId'

export const getDemoPoolContractAddress = (networkName, ticker) => {
  let chainId = nameToChainId(networkName)
  try {
    return CONTRACT_ADDRESSES[chainId][`${ticker.toUpperCase()}_PRIZE_POOL_CONTRACT_ADDRESS`]
  } catch (e) {
    console.warn('could not get pool address (no chainId?)')
    console.warn(e.message)
  }
}