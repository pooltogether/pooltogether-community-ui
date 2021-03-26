import { useEffect, useState } from 'react'

import { readProvider } from 'lib/services/readProvider'
import { useNetwork } from 'lib/hooks/useNetwork'

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
