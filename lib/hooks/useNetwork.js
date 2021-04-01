import { useContext, useMemo } from 'react'
import { useRouter } from 'next/router'
import { getChain } from 'evm-chains-extended'

import { POOL_ALIASES } from 'lib/constants'
import { getNetworkNameAliasByChainId, NETWORK } from 'lib/utils/networks'
import { WalletContext } from 'lib/components/WalletContextProvider'

// TODO: Don't return until wallet is ready so we know if there will be a change
// then we won't fetch mainnet, throw it away and fetch what the wallet is connected to
export const useNetwork = () => {
  const router = useRouter()
  const { _onboard } = useContext(WalletContext)
  const walletNetwork = _onboard.getState().network

  return useMemo(
    () => getNetwork(router.query.poolAlias, router.query.networkName, walletNetwork),
    [router?.query?.poolAlias, router?.query?.networkName, walletNetwork]
  )
}

const getNetwork = (poolAlias, routerNetwork, walletNetworkChainId) => {
  console.log({ poolAlias, routerNetwork, walletNetworkChainId })
  const pool = POOL_ALIASES[poolAlias]

  let chainId
  if (pool) {
    chainId = pool.chainId
  } else if (routerNetwork) {
    chainId = NETWORK[routerNetwork]
  } else if (walletNetworkChainId) {
    chainId = walletNetworkChainId
  } else {
    chainId = NETWORK.mainnet
  }

  const networkData = getChain(chainId)
  const walletNetworkData = walletNetworkChainId ? getChain(walletNetworkChainId) : {}

  console.log(networkData)
  console.log(chainId)

  return {
    ...networkData,
    networkName: getNetworkNameAliasByChainId(chainId),
    walletConnected: Boolean(walletNetworkChainId),
    walletMatchesNetwork: walletNetworkChainId ? chainId === walletNetworkChainId : null,
    walletNetwork: {
      ...walletNetworkData
    }
  }
}
