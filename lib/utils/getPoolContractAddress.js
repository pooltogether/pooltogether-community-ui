import { ADDRESSES } from 'lib/constants'
import { digChainIdFromWalletState } from 'lib/utils/digChainIdFromWalletState'

export const getPoolContractAddress = (walletContext) => {
  const chainId = digChainIdFromWalletState(walletContext)

  return ADDRESSES[chainId]['POOL_CONTRACT_ADDRESS']
}