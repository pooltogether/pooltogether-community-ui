import { useEffect, useState } from 'react'

import { useReadProvider } from 'lib/hooks/useReadProvider'

export const useEnsName = (address) => {
  const { readProvider: provider, isLoaded: readProviderIsLoaded } = useReadProvider()
  const [ensName, setEnsName] = useState('')

  useEffect(() => {
    const lookup = async () => {
      if (address && readProviderIsLoaded) {
        try {
          const _ensName = await provider.lookupAddress(address)
          setEnsName(_ensName || '')
        } catch (e) {
          console.warn(e)
        }
      }
    }

    lookup()
  }, [address, readProviderIsLoaded])

  return ensName
}
