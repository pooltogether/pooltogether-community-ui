import axios from 'axios'
import { useQuery } from 'react-query'

import { useNetwork } from 'lib/hooks/useNetwork'
import { QUERY_KEYS } from 'lib/constants'

import Dai from 'assets/images/dai.svg'

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3'

export const useCoingeckoTokenData = (contractAddress) => {
  const { id: networkId } = useNetwork()

  return useQuery(
    [QUERY_KEYS.coingeckoTokenData, contractAddress, networkId],
    () => getCoingeckoTokenData(contractAddress),
    {
      enabled: networkId === 1 && contractAddress
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
    }

    return response.data
  } catch (e) {
    console.warn(e.message)
    return undefined
  }
}
