import { useContext } from 'react'
import { getChain } from '@pooltogether/evm-chains-extended'

import { SUPPORTED_NETWORKS } from 'lib/constants'
import { WalletContext } from 'lib/components/WalletContextProvider'

export const useWalletNetwork = (props) => {
  const walletContext = useContext(WalletContext)
  const walletChainId = walletContext._onboard.getState().network

  const walletOnUnsupportedNetwork =
    (walletChainId && !SUPPORTED_NETWORKS.includes(walletChainId)) ||
    typeof walletChainId === 'undefined'

  let walletNetworkData = {}
  try {
    walletNetworkData = getChain(walletChainId)
  } catch (error) {}

  return {
    walletChainId,
    walletOnUnsupportedNetwork,
    walletConnected: Boolean(walletChainId) && walletContext._onboard.getState().wallet.name,
    walletName: walletContext?.state?.wallet?.name,
    walletNetworkShortName: walletNetworkData.name || 'unknown network',
    walletNetwork: {
      ...walletNetworkData
    }
  }
}
