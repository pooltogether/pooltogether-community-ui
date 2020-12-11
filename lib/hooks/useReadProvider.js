import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'

import { readProvider } from 'lib/services/readProvider'
import { networkAtom } from 'lib/hooks/useNetwork'

export const useReadProvider = () => {
  const [defaultReadProvider, setDefaultReadProvider] = useState()
  const [network] = useAtom(networkAtom)

  useEffect(() => {
    const getReadProvider = async () => {
      const defaultReadProvider = await readProvider(network.name)
      setDefaultReadProvider(defaultReadProvider)
    }
    getReadProvider()
  }, [network.name])

  return defaultReadProvider
}
