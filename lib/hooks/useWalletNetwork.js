import { useContext } from 'react'
import { getChain } from '@pooltogether/evm-chains-extended'

import { SUPPORTED_NETWORKS } from 'lib/constants'
import { WalletContext } from 'lib/components/WalletContextProvider'

export const useWalletNetwork = (props) => {
  const walletContext = useContext(WalletContext)
  const walletChainId = walletContext._onboard.getState().network

  const walletConnected =
    Boolean(walletChainId) && Boolean(walletContext._onboard.getState().wallet.name)
  const walletOnUnsupportedNetwork = walletConnected && !SUPPORTED_NETWORKS.includes(walletChainId)

  let walletNetworkData = {}
  try {
    walletNetworkData = getChain(walletChainId)
  } catch (error) {}

  return {
    walletChainId,
    walletOnUnsupportedNetwork,
    walletConnected,
    walletName: walletContext?.state?.wallet?.name,
    walletNetworkShortName: walletNetworkData?.name || 'unknown network',
    walletNetwork: {
      ...walletNetworkData
    }
  }
}
