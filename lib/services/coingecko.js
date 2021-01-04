import axios from 'axios'
import Dai from 'assets/images/dai.svg'
import Bac from 'assets/images/basis-cash.svg'
import Bas from 'assets/images/basis-share.svg'

const COIN_GECKO_API_URL = 'https://api.coingecko.com/api/v3'

export const getCoinGeckoId = (token) => {
  // Override for Tokens
  if (token.symbol === 'DAI' && token.name === 'Dai Stablecoin') {
    return 'dai dai'
  } else if (token.symbol === 'BAS' && token.name === 'BAS') {
    return 'bas basis share'
  } else if (token.symbol === 'BAC' && token.name === 'BAC') {
    return 'bac basis cash'
  }

  return `${token.symbol.toLowerCase()} ${token.name.toLowerCase()}`
}

export const getCoinGeckoTokenList = async () => {
  const response = await axios.get(`${COIN_GECKO_API_URL}/coins/list`)
  return response
}

export const getCoinGeckoTokenData = async (tokenId) => {
  console.log(tokenId, 'getCoinGeckoTokenData')
  if (!tokenId) return undefined

  const response = await axios.get(`${COIN_GECKO_API_URL}/coins/${tokenId}`)

  // Override for Dai
  if (tokenId === 'dai') {
    response.data.image.thumb = Dai
    response.data.image.small = Dai
    response.data.image.large = Dai
  }

  return response
}
