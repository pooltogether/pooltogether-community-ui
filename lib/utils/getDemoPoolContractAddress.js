import { ADDRESSES } from 'lib/constants'
// import { digChainIdFromWalletState } from 'lib/utils/digChainIdFromWalletState'

export const getDemoPoolContractAddress = (networkName, ticker) => {
  let chainId = 1
  if (networkName === 'kovan') {
    chainId = 42
  }

  try {
    return ADDRESSES[chainId][`${ticker.toUpperCase()}_POOL_MANAGER_CONTRACT_ADDRESS`]
  } catch (e) {
    console.warn('could not get pool address (no chainId?)')
    console.warn(e.message)
  }
}