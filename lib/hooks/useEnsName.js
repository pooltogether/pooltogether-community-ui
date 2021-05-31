import { useEffect, useState } from 'react'
import { useReadProvider } from '@pooltogether/hooks'

import { useNetwork } from 'lib/hooks/useNetwork'

const truncateEnsName = (ensName) => ensName?.substr(0, 30) || ''

export const useEnsName = (address) => {
  const chainId = useNetwork()
  const { data: provider, isFetched: readProviderIsLoaded } = useReadProvider(chainId)
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
