import axios from 'axios'
import Dai from 'assets/images/dai.svg'
import Aave from 'assets/images/aave.svg'
import Snx from 'assets/images/snx.svg'

const COIN_GECKO_API_URL = 'https://api.coingecko.com/api/v3'

export const getCoinGeckoId = (token) => {
  // Override for Tokens
  if (token.symbol === 'DAI' && token.name === 'Dai Stablecoin') {
    return 'dai dai'
  } else if (token.symbol === 'BAS' && token.name === 'BAS') {
    return 'bas basis share'
  } else if (token.symbol === 'BAC' && token.name === 'BAC') {
    return 'bac basis cash'
  } else if (token.symbol === 'AAVE' && token.name === 'Aave Token') {
    return 'aave aave'
  } else if (token.symbol === 'SUSHI' && token.name === 'SushiToken') {
    return 'sushi sushi'
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

  // Override for Dai
  if (tokenId === 'dai') {
    response.data.image.thumb = Dai
    response.data.image.small = Dai
    response.data.image.large = Dai
  } else if (tokenId === 'aave') {
    response.data.image.thumb = Aave
    response.data.image.small = Aave
    response.data.image.large = Aave
  } else if (tokenId === 'havven') {
    response.data.image.thumb = Snx
    response.data.image.small = Snx
    response.data.image.large = Snx
  }

  return response
}
