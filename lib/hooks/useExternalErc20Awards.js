import { batch, contract } from '@pooltogether/etherplex'
import { useQuery } from 'react-query'

import {
  DATA_REFRESH_POLLING_INTERVAL,
  DEFAULT_TOKEN_PRECISION,
  NO_REFETCH_QUERY_OPTIONS,
  QUERY_KEYS
} from 'lib/constants'
import { usePoolChainValues } from 'lib/hooks/usePoolChainValues'
import { useReadProvider } from '@pooltogether/hooks'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { usePrizePoolContracts } from 'lib/hooks/usePrizePoolContracts'

import ERC20Abi from 'abis/ERC20Abi'
import { useNetwork } from 'lib/hooks/useNetwork'

export const useExternalErc20Awards = () => {
  const { data: prizePoolContracts, isFetched: prizePoolContractsIsFetched } =
    usePrizePoolContracts()
  const { data: poolChainValues, isFetched: poolChainValuesIsFetched } = usePoolChainValues()
  const chainId = useNetwork()
  const { data: provider, isFetched: readProviderIsLoaded } = useReadProvider(chainId)

  const prizePoolAddress = prizePoolContracts?.prizePool?.address
  const externalErc20Addresses = poolChainValues?.prize?.externalErc20Awards

  const enabled =
    Array.isArray(externalErc20Addresses) &&
    prizePoolAddress &&
    readProviderIsLoaded &&
    prizePoolContractsIsFetched &&
    poolChainValuesIsFetched

  return useQuery(
    [QUERY_KEYS.fetchExternalErc20Awards, prizePoolAddress, externalErc20Addresses],
    async () => await _fetchErc20AwardBalances(provider, prizePoolAddress, externalErc20Addresses),
    // @ts-ignore
    {
      ...NO_REFETCH_QUERY_OPTIONS,
      enabled,
      staleTime: Infinity
    }
  )
}

export const _fetchErc20AwardBalances = async (provider, prizePool, erc20Addresses) => {
  const flattenedValues = []

  let etherplexTokenContract
  for (const address of erc20Addresses) {
    etherplexTokenContract = contract(address, ERC20Abi, address)
    try {
      const response = await batch(
        provider,
        etherplexTokenContract.balanceOf(prizePool).name().symbol().decimals()
      )
      const values = response[address]

      const decimals = values.decimals?.[0] || DEFAULT_TOKEN_PRECISION
      const formattedBalance = numberWithCommas(values.balanceOf[0], { decimals })

      flattenedValues.push({
        address,
        formattedBalance,
        decimals,
        symbol: values.symbol[0],
        balance: values.balanceOf[0],
        name: values.name[0],
        source: 'External ERC20'
      })
    } catch (e) {
      console.error(e.message)
    }
  }

  return flattenedValues
}
