import { atom, useAtom } from 'jotai'
import { getCoinGeckoId, getCoinGeckoTokenList } from 'lib/services/coingecko'
import { useEffect } from 'react'

export const coinGeckoTokenIdsAtom = atom({})

export const useCoinGeckoTokenIds = () => {
  const [coinGeckoTokenIds, setCoinGeckoTokenIds] = useAtom(coinGeckoTokenIdsAtom)

  useEffect(() => {
    const getTokenData = async () => {
      try {
        const response = await getCoinGeckoTokenList()
        const tokenIds = {
          _error: false
        }
        response.data.forEach((token) => {
          tokenIds[getCoinGeckoId(token)] = token.id
        })
        console.log(tokenIds)
        setCoinGeckoTokenIds(tokenIds)
      } catch (e) {
        console.log("Can't access CoinGecko Token Data")
        setCoinGeckoTokenIds({
          _error: true
        })
      }
    }

    getTokenData()
  }, [])

  return [coinGeckoTokenIds, setCoinGeckoTokenIds]
}
