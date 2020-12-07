import { useAtom } from 'jotai'
import { Card } from 'lib/components/Card'
import { NewPrizeCountdown } from 'lib/components/NewPrizeCountdown'
import {
  coinGeckoTokenIdsAtom,
  erc20AwardsAtom,
  poolChainValuesAtom,
  prizePoolTypeAtom
} from 'lib/components/PoolUI'
import { DEFAULT_TOKEN_PRECISION, PRIZE_POOL_TYPE } from 'lib/constants'
import { getCoinGeckoId, getCoinGeckoTokenData } from 'lib/services/coingecko'
import { calculateEstimatedPoolPrize } from 'lib/utils/calculateEstimatedPoolPrize'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'

export const PrizeCard = (props) => {
  const [prizeEstimate, setPrizeEstimate] = useState(0)
  const [poolChainValues] = useAtom(poolChainValuesAtom)
  const [erc20Awards] = useAtom(erc20AwardsAtom)
  const [prizePoolType] = useAtom(prizePoolTypeAtom)

  const {
    awardBalance,
    prizePeriodRemainingSeconds,
    poolTotalSupply,
    supplyRatePerBlock
  } = poolChainValues

  const tokenDecimals = poolChainValues.tokenDecimals || DEFAULT_TOKEN_PRECISION
  const tokenSymbol = poolChainValues.tokenSymbol || 'TOKEN'

  useEffect(() => {
    const estimatedPoolPrize = calculateEstimatedPoolPrize({
      tokenDecimals,
      awardBalance,
      poolTotalSupply,
      supplyRatePerBlock,
      prizePeriodRemainingSeconds
    })

    setPrizeEstimate(estimatedPoolPrize)
  }, [poolTotalSupply, supplyRatePerBlock, prizePeriodRemainingSeconds, awardBalance])

  return (
    <Card>
      {prizePoolType === PRIZE_POOL_TYPE.compound && (
        <h3>
          {displayAmountInEther(prizeEstimate, { precision: 2, decimals: tokenDecimals })}{' '}
          {tokenSymbol}
        </h3>
      )}
      {erc20Awards.length >= 1 && (
        <ul>
          {erc20Awards.map((token, index) => (
            <AwardLine token={token} index={index} />
          ))}
        </ul>
      )}
      <NewPrizeCountdown pool={poolChainValues} />
    </Card>
  )
}

export const AwardLine = ({ token, index }) => {
  const [coinGeckoTokenIds] = useAtom(coinGeckoTokenIdsAtom)
  const tokenId = coinGeckoTokenIds[getCoinGeckoId(token)]
  const { data } = useQuery(tokenId, async () => getCoinGeckoTokenData(tokenId))

  const imageUrl = data?.data?.image?.small

  if (imageUrl) {
    return (
      <li key={index + token.symbol} className='flex'>
        <img src={imageUrl} />
        {`${token.symbol}: ${token.formattedBalance}`}
      </li>
    )
  }

  return <li key={index + token.symbol}>{`${token.symbol}: ${token.formattedBalance}`}</li>
}
