import { atom, useAtom } from 'jotai'
import { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'

import { nameToChainId } from 'lib/utils/nameToChainId'
import { EMPTY_ERROR_STATE, errorStateAtom } from 'lib/components/PoolData'
import { WalletContext } from 'lib/components/WalletContextProvider'

export const networkAtom = atom({})

export const useNetwork = () => {
  const router = useRouter()
  const walletContext = useContext(WalletContext)
  
  const [network, setNetwork] = useAtom(networkAtom)
  const [errorState, setErrorState] = useAtom(errorStateAtom)
  
  const poolAlias = router.query.poolAlias
  let networkName = 'rinkeby'
  if (poolAlias && poolAlias !== 'rinkeby-test') {
    networkName = 'mainnet'
  } else if (router.query.networkName) {
    networkName = router.query.networkName
  }
  
  const walletNetwork = walletContext._onboard.getState().network

  useEffect(() => {
    setErrorState(EMPTY_ERROR_STATE)
    setNetwork({
      name: networkName,
      id: nameToChainId(networkName),
      walletNetwork
    })
  }, [poolAlias, networkName, walletNetwork])

  return network
}
