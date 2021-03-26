import { batch, contract } from '@pooltogether/etherplex'
import PrizeStrategyAbi from '@pooltogether/pooltogether-contracts/abis/PeriodicPrizeStrategy'

import { usePoolChainValues } from 'lib/hooks/usePoolChainValues'
import { useReadProvider } from 'lib/hooks/useReadProvider'
import { QUERY_KEYS } from 'lib/constants'
import { useQuery } from 'react-query'
import { usePrizePoolContracts } from 'lib/hooks/usePrizePoolContracts'

export const useExternalErc721Awards = () => {
  const {
    data: prizePoolContracts,
    isFetched: prizePoolContractsIsFetched
  } = usePrizePoolContracts()
  const { data: poolChainValues, isFetched: poolChainValuesIsFetched } = usePoolChainValues()
  const { readProvider: provider, isLoaded: readProviderLoaded } = useReadProvider()

  const prizeStrategyAddress = prizePoolContracts?.prizeStrategy?.address
  const externalErc721Addresses = poolChainValues?.prize?.externalErc20Awards

  const enabled =
    Array.isArray(externalErc721Addresses) &&
    prizeStrategyAddress &&
    readProviderLoaded &&
    prizePoolContractsIsFetched &&
    poolChainValuesIsFetched

  return useQuery(
    [QUERY_KEYS.fetchExternalErc721Awards, prizeStrategyAddress, externalErc721Addresses],
    async () => await _fetchErc721TokenIds(provider, prizeStrategyAddress, externalErc721Addresses),
    {
      enabled,
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity
    }
  )
}

export const _fetchErc721TokenIds = async (provider, prizeStrategyAddress, erc721Addresses) => {
  const flattenedValues = []
  const batchCalls = []

  for (const address of erc721Addresses) {
    const prizeStrategyContract = contract(address, PrizeStrategyAbi, prizeStrategyAddress)
    batchCalls.push(prizeStrategyContract.getExternalErc721AwardTokenIds(address))
  }

  try {
    const response = await batch(provider, ...batchCalls)

    Object.keys(response).forEach((address) => {
      flattenedValues.push({
        address,
        tokenIds: response[address].getExternalErc721AwardTokenIds
      })
    })

    return flattenedValues
  } catch (e) {
    console.error(e)
    return []
  }
}
