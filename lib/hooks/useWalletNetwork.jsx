import { useContext } from 'react'
import { getChain } from '@pooltogether/evm-chains-extended'

import { WalletContext } from 'lib/components/WalletContextProvider'

export const useWalletNetwork = (props) => {
  const walletContext = useContext(WalletContext)
  const walletChainId = walletContext._onboard.getState().network

  // walletConnected = Boolean(walletChainId) || !_onboard.getState().wallet.name ||

  let walletNetworkData = {}
  try {
    walletNetworkData = getChain(walletChainId)
  } catch (error) {
    // console.warn(error)
  }

  return {
    walletChainId,
    walletConnected: Boolean(walletChainId),
    walletName: walletContext?.state?.wallet?.name,
    walletNetworkShortName: walletNetworkData.name || 'unknown network',
    walletNetwork: {
      ...walletNetworkData
    }
  }
}
