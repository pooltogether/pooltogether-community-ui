import { useQuery } from 'react-query'

import { readProvider } from 'lib/services/readProvider'
import { useNetwork } from 'lib/hooks/useNetwork'
import { QUERY_KEYS } from 'lib/constants'

export const useReadProvider = () => {
  const { chainId, name: networkName } = useNetwork()

  const { data: defaultReadProvider, isFetched } = useQuery(
    [QUERY_KEYS.readProvider, networkName],
    () => readProvider(networkName)
  )

  const isLoaded =
    defaultReadProvider &&
    networkName &&
    isFetched &&
    Object.keys(defaultReadProvider).length > 0 &&
    defaultReadProvider?.network?.chainId === chainId

  return {
    readProvider: defaultReadProvider,
    isLoaded
  }
}
