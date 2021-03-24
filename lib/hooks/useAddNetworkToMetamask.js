import { WalletContext } from 'lib/components/WalletContextProvider'
import { NETWORK_DATA } from 'lib/utils/networks'
import { useContext, useMemo } from 'react'

export const useAddNetworkToMetamask = (chainId) => {
  const walletContext = useContext(WalletContext)

  // TODO: hide for rinkeby, kovan etc
  console.log(walletContext)

  return useMemo(() => {
    return async () => {
      try {
        const ethereum = window.ethereum

        const network = NETWORK_DATA[chainId]
        const formattedNetwork = {
          chainId: `0x${chainId.toString(16)}`,
          chainName: network.view,
          nativeCurrency: network.nativeCurrency,
          rpcUrls: network.rpcUrls,
          blockExplorerUrls: [network.blockExplorerUrl]
        }

        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [formattedNetwork]
        })
      } catch (error) {
        console.error(error)
      }
    }
  }, [chainId])
}
