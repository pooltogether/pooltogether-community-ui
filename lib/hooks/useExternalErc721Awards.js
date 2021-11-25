import { batch, contract } from '@pooltogether/etherplex'
import PrizeStrategyAbi from '@pooltogether/pooltogether-contracts/abis/PeriodicPrizeStrategy'

import { usePoolChainValues } from 'lib/hooks/usePoolChainValues'
import { useReadProvider } from '@pooltogether/hooks'
import { NO_REFETCH_QUERY_OPTIONS, QUERY_KEYS } from 'lib/constants'
import { useQuery } from 'react-query'
import { usePrizePoolContracts } from 'lib/hooks/usePrizePoolContracts'
import { useNetwork } from 'lib/hooks/useNetwork'

export const useExternalErc721Awards = () => {
  const { data: prizePoolContracts, isFetched: prizePoolContractsIsFetched } =
    usePrizePoolContracts()
  const { data: poolChainValues, isFetched: poolChainValuesIsFetched } = usePoolChainValues()
  const { chainId } = useNetwork()
  const readProvider = useReadProvider(chainId)

  const prizeStrategyAddress = prizePoolContracts?.prizeStrategy?.address
  const externalErc721Addresses = poolChainValues?.prize?.externalErc721Awards

  const enabled =
    Array.isArray(externalErc721Addresses) &&
    prizeStrategyAddress &&
    !!readProvider &&
    prizePoolContractsIsFetched &&
    poolChainValuesIsFetched

  return useQuery(
    [QUERY_KEYS.fetchExternalErc721Awards, prizeStrategyAddress, externalErc721Addresses],
    async () =>
      await _fetchErc721TokenIds(readProvider, prizeStrategyAddress, externalErc721Addresses),
    // @ts-ignore
    {
      ...NO_REFETCH_QUERY_OPTIONS,
      enabled,
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
