import { useEffect, useState } from 'react'

import { useReadProvider } from 'lib/hooks/useReadProvider'

const truncateEnsName = (ensName) => ensName?.substr(0, 30) || ''

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

  return { shortenedEnsName: truncateEnsName(ensName), ensName }
}
