import { useQuery } from 'react-query'

import { QUERY_KEYS } from 'lib/constants'
import { readProvider } from 'lib/services/readProvider'
import { useNetwork } from 'lib/hooks/useNetwork'

export const useReadProvider = () => {
  const { chainId } = useNetwork()
  // const { chainId, network: networkName } = useNetwork()

  // networkName

  const { data: defaultReadProvider, isFetched } = useQuery(
    [QUERY_KEYS.readProvider, chainId],
    () => readProvider(chainId)
  )

  const isLoaded =
    defaultReadProvider &&
    chainId &&
    isFetched &&
    Object.keys(defaultReadProvider).length > 0 &&
    defaultReadProvider?.network?.chainId === chainId

  return {
    readProvider: defaultReadProvider,
    isLoaded
  }
}
