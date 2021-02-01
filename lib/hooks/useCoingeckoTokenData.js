import axios from 'axios'
import { useQuery } from 'react-query'

import { useNetwork } from 'lib/hooks/useNetwork'
import Dai from 'assets/images/dai.svg'

const COIN_GECKO_API_URL = 'https://api.coingecko.com/api/v3'

export const useCoingeckoTokenData = (contractAddress) => {
  const { id: networkId } = useNetwork()

  return useQuery([contractAddress, networkId], () => getgoingeckoTokenData(contractAddress), {
    enabled: networkId === 1 && contractAddress
  })
}

const getgoingeckoTokenData = async (contractAddress) => {
  try {
    const response = await axios.get(
      `${COIN_GECKO_API_URL}/coins/ethereum/contract/${contractAddress}`
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
