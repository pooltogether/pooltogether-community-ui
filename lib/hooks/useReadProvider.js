import { readProvider } from 'lib/services/readProvider'
import { useEffect, useState } from 'react'

export const useReadProvider = (networkName) => {
  const [defaultReadProvider, setDefaultReadProvider] = useState()

  useEffect(() => {
    const getReadProvider = async () => {
      const defaultReadProvider = await readProvider(networkName)
      setDefaultReadProvider(defaultReadProvider)
    }
    getReadProvider()
  }, [networkName])

  return defaultReadProvider
}
