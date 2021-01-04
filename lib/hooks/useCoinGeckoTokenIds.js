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

        // // Hardcode tokens for BAS and BAC
        // tokenIds['bac bac'] = 'bac bac'
        // tokenIds['bas bas'] = 'bas bas'

        console.log(tokenIds)

        setCoinGeckoTokenIds(tokenIds)
      } catch (e) {
        console.warn("Can't access CoinGecko Token Data")
        setCoinGeckoTokenIds({
          _error: true
        })
      }
    }

    getTokenData()
  }, [])

  return [coinGeckoTokenIds, setCoinGeckoTokenIds]
}
