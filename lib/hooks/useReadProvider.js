import { useEffect, useState } from 'react'

import { readProvider } from 'lib/services/readProvider'
import { useNetwork } from 'lib/hooks/useNetwork'
import { useQuery } from 'react-query'

export const useReadProvider = () => {
  const { chainId, name: networkName } = useNetwork()

  const { data: defaultReadProvider, isFetched } = useQuery(['readProvider', networkName], () =>
    readProvider(networkName)
  )

  const isLoaded =
    defaultReadProvider &&
    networkName &&
    isFetched &&
    Object.keys(defaultReadProvider).length > 0 &&
    defaultReadProvider.network.chainId === chainId

  return {
    readProvider: defaultReadProvider,
    isLoaded
  }
}
