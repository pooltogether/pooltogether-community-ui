import { useMemo } from 'react'
import axios from 'axios'
import { useQuery } from 'react-query'

import { useNetwork } from 'lib/hooks/useNetwork'
import { QUERY_KEYS } from 'lib/constants'
import { isValidAddress } from 'lib/utils/isValidAddress'

import Dai from 'assets/images/dai.svg'
import WEth from 'assets/images/weth.png'

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3'

export const useCoingeckoTokenData = (contractAddress) => {
  const { chainId } = useNetwork()

  const validAddress = useMemo(() => isValidAddress(contractAddress), [contractAddress])

  return useQuery(
    [QUERY_KEYS.coingeckoTokenData, contractAddress, chainId],
    async () => await getCoingeckoTokenData(contractAddress),
    {
      staleTime: Infinity,
      enabled: Boolean(contractAddress) && validAddress
    }
  )
}

const getCoingeckoTokenData = async (contractAddress) => {
  try {
    const response = await axios.get(
      `${COINGECKO_API_URL}/coins/ethereum/contract/${contractAddress}`
    )

    // Override the Dai image from CoinGecko
    if (response.data.id === 'dai') {
      response.data.image.thumb = Dai
      response.data.image.small = Dai
      response.data.image.large = Dai
    } else if (response.data.id === 'weth') {
      response.data.image.thumb = WEth
      response.data.image.small = WEth
      response.data.image.large = WEth
    }

    return response.data
  } catch (e) {
    console.warn(e.message)
    return undefined
  }
}
