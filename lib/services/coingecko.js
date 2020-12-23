import axios from 'axios'

const COIN_GECKO_API_URL = 'https://api.coingecko.com/api/v3'

export const getCoinGeckoId = (token) => {
  // Override for mainnet Dai
  if (token.symbol === 'DAI' && token.name === 'Dai Stablecoin') {
    return 'dai dai'
  }

  return `${token.symbol.toLowerCase()} ${token.name.toLowerCase()}`
}

export const getCoinGeckoTokenList = async () => {
  const response = await axios.get(`${COIN_GECKO_API_URL}/coins/list`)
  return response
}

export const getCoinGeckoTokenData = async (tokenId) => {
  if (!tokenId) return undefined
  const response = await axios.get(`${COIN_GECKO_API_URL}/coins/${tokenId}`)
  return response
}
