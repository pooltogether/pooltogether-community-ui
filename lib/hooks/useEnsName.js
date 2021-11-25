import { useEffect, useState } from 'react'
import { useReadProvider } from '@pooltogether/hooks'

import { useNetwork } from 'lib/hooks/useNetwork'

const truncateEnsName = (ensName) => ensName?.substr(0, 30) || ''

export const useEnsName = (address) => {
  const { chainId } = useNetwork()
  const readProvider = useReadProvider(chainId)
  const [ensName, setEnsName] = useState('')

  useEffect(() => {
    const lookup = async () => {
      if (address && !!readProvider) {
        try {
          const _ensName = await readProvider.lookupAddress(address)
          setEnsName(_ensName || '')
        } catch (e) {
          console.warn(e)
        }
      }
    }

    lookup()
  }, [address, readProvider])

  return { shortenedEnsName: truncateEnsName(ensName), ensName }
}
