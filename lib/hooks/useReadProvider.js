import { useEffect, useState } from 'react'

import { readProvider } from 'lib/services/readProvider'
import { useNetwork } from 'lib/hooks/useNetwork'

// TODO: Don't set loaded until wallet is ready so we know if there will be a change
// then we won't fetch mainnet, throw it away and fetch what the wallet is connected to
export const useReadProvider = () => {
  const [defaultReadProvider, setDefaultReadProvider] = useState({})
  const { chainId, name: networkName } = useNetwork()

  useEffect(() => {
    const getReadProvider = async () => {
      const defaultReadProvider = await readProvider(networkName)

      setDefaultReadProvider(defaultReadProvider)
    }
    getReadProvider()
  }, [networkName])

  const isLoaded =
    defaultReadProvider &&
    networkName &&
    Object.keys(defaultReadProvider).length > 0 &&
    defaultReadProvider.network.chainId === chainId

  return {
    readProvider: defaultReadProvider,
    isLoaded
  }
}
