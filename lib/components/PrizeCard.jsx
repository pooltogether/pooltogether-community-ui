import { useAtom } from 'jotai'
import FeatherIcon from 'feather-icons-react'
import classnames from 'classnames'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'

import { Button } from 'lib/components/Button'
import { Card } from 'lib/components/Card'
import { LoadingDots } from 'lib/components/LoadingDots'
import { NewPrizeCountdown } from 'lib/components/NewPrizeCountdown'
import { DEFAULT_TOKEN_PRECISION, PRIZE_POOL_TYPE } from 'lib/constants'
import { coinGeckoTokenIdsAtom } from 'lib/hooks/useCoinGeckoTokenIds'
import { erc20AwardsAtom } from 'lib/hooks/useExternalErc20Awards'
import { networkAtom } from 'lib/hooks/useNetwork'
import { poolAddressesAtom } from 'lib/hooks/usePoolAddresses'
import { poolChainValuesAtom } from 'lib/hooks/usePoolChainValues'
import { prizePoolTypeAtom } from 'lib/hooks/usePrizePoolType'
import { getCoinGeckoId, getCoinGeckoTokenData } from 'lib/services/coingecko'
import { calculateEstimatedPoolPrize } from 'lib/utils/calculateEstimatedPoolPrize'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

export const PrizeCard = (props) => {
  const { showLinks } = props
  const [network] = useAtom(networkAtom)
  const [poolAddresses] = useAtom(poolAddressesAtom)

  const networkName = network.name
  const prizePoolAddress = poolAddresses.prizePool

  return (
    <Card className='flex flex-col max-w-screen-sm mx-auto'>
      <h2 className='mx-auto'>Current Prize</h2>
      <Prizes />
      <NewPrizeCountdown center />
      {showLinks && (
        <div className='flex flex-col mt-4 w-2/4 mx-auto'>
          <Button
            href={`/pools/[networkName]/[prizePoolAddress]/home`}
            as={`/pools/${networkName}/${prizePoolAddress}/home`}
          >
            Get tickets
          </Button>
          <div className='flex justify-between mt-4'>
            <Link
              href={`/pools/[networkName]/[prizePoolAddress]/admin`}
              as={`/pools/${networkName}/${prizePoolAddress}/admin`}
            >
              <a className='flex underline font-bold'>
                Manage pool{' '}
                <FeatherIcon
                  icon='settings'
                  strokeWidth='0.25rem'
                  className={'ml-3 my-auto w-4 h-4 stroke-2 stroke-current'}
                />
              </a>
            </Link>
            <Link
              href={`/pools/[networkName]/[prizePoolAddress]/home`}
              as={`/pools/${networkName}/${prizePoolAddress}/home`}
            >
              <a className='flex underline font-bold'>
                My Account{' '}
                <FeatherIcon
                  icon='arrow-right'
                  strokeWidth='0.25rem'
                  className={'ml-3 my-auto w-4 h-4 stroke-2 stroke-current'}
                />
              </a>
            </Link>
          </div>
        </div>
      )}
    </Card>
  )
}

const Prizes = (props) => {
  const { className } = props

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

  if (erc20Awards.loading) {
    return (
      <div className='p-10'>
        <LoadingDots />
      </div>
    )
  }

  let awards = [...erc20Awards.awards]

  if (prizePoolType === PRIZE_POOL_TYPE.compound) {
    const compoundAwardToken = {
      symbol: tokenSymbol,
      formattedBalance: displayAmountInEther(prizeEstimate, {
        precision: 2,
        decimals: tokenDecimals
      }),
      name: poolChainValues.tokenName || ''
    }
    awards.unshift(compoundAwardToken)
  }

  if (awards.length === 1) {
    return <SinglePrizeItem token={awards[0]} className={className} />
  }

  return (
    <div className={className}>
      <ul>
        {awards.map((token, index) => (
          <PrizeListItem token={token} index={index} />
        ))}
      </ul>
    </div>
  )
}

const SinglePrizeItem = (props) => {
  const { token, className } = props
  const [coinGeckoTokenIds] = useAtom(coinGeckoTokenIdsAtom)
  const tokenId = coinGeckoTokenIds[getCoinGeckoId(token)]
  const { data } = useQuery(tokenId, async () => getCoinGeckoTokenData(tokenId))
  const imageUrl = data?.data?.image?.small

  return (
    <div className={classnames('flex mx-auto my-8 leading-none', className)}>
      {imageUrl && <img src={imageUrl} className='w-16 h-16 mr-4 my-auto' />}
      <span className='font-bold text-9xl mr-4 my-auto'>{token.formattedBalance}</span>
      <span className='font-bolt text-4xl mt-auto mb-1'>{token.symbol}</span>
    </div>
  )
}

const PrizeListItem = (props) => {
  const token = props.token
  const index = props.index || 0
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
