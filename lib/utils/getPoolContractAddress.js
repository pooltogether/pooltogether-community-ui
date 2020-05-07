import { ADDRESSES } from 'lib/constants'
import { digChainIdFromWalletState } from 'lib/utils/digChainIdFromWalletState'

export const getPoolContractAddress = (walletContext) => {
  const chainId = digChainIdFromWalletState(walletContext)

  try {
    return ADDRESSES[chainId]['POOL_CONTRACT_ADDRESS']
  } catch (e) {
    console.warn('could not get pool address (no chainId?)')
    console.warn(e.message)
  }
}