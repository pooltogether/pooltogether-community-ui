import { contractAddresses } from '@pooltogether/current-pool-data'

import { nameToChainId } from './nameToChainId'

export const getDemoPoolContractAddress = (networkName, ticker) => {
  let chainId = nameToChainId(networkName)
  try {
    return contractAddresses[chainId]?.[`${ticker.toLowerCase()}`]?.prizePool
  } catch (e) {
    console.warn('could not get pool address (no chainId?)')
    console.warn(e.message)
  }
}
