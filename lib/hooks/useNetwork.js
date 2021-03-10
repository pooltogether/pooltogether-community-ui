import { useContext, useMemo } from 'react'
import { useRouter } from 'next/router'

import { POOL_ALIASES } from 'lib/constants'
import { nameToChainId } from 'lib/utils/nameToChainId'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { chainIdToName } from 'lib/utils/chainIdToName'

export const useNetwork = () => {
  const router = useRouter()
  const walletContext = useContext(WalletContext)
  const walletNetwork = walletContext._onboard.getState().network

  return useMemo(
    () => getNetwork(router.query.poolAlias, router.query.networkName, walletNetwork),
    [router?.query?.poolAlias, router?.query?.networkName, walletNetwork]
  )
}

const getNetwork = (poolAlias, routerNetwork, walletNetwork) => {
  const pool = POOL_ALIASES[poolAlias]

  if (pool) {
    return [nameToChainId(pool.networkName), pool.networkName, walletNetwork]
  } else if (routerNetwork) {
    return [nameToChainId(routerNetwork), routerNetwork, walletNetwork]
  } else if (walletNetwork) {
    return [walletNetwork, chainIdToName(walletNetwork), walletNetwork]
  }
  return [1, 'mainnet', walletNetwork]
}
