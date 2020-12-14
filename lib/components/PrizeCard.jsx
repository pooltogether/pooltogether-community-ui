import { useAtom } from 'jotai'
import FeatherIcon from 'feather-icons-react'
import classnames from 'classnames'
import Link from 'next/link'
import React from 'react'
import { useQuery } from 'react-query'

import { Button } from 'lib/components/Button'
import { Card, CardTitle } from 'lib/components/Card'
import { LoadingDots } from 'lib/components/LoadingDots'
import { NewPrizeCountdown } from 'lib/components/NewPrizeCountdown'
import { coinGeckoTokenIdsAtom } from 'lib/hooks/useCoinGeckoTokenIds'
import { networkAtom } from 'lib/hooks/useNetwork'
import { poolAddressesAtom } from 'lib/hooks/usePoolAddresses'
import { getCoinGeckoId, getCoinGeckoTokenData } from 'lib/services/coingecko'
import { useAwardsList } from 'lib/hooks/useAwardsList'

export const PrizeCard = (props) => {
  const { showLinks, className } = props
  const [network] = useAtom(networkAtom)
  const [poolAddresses] = useAtom(poolAddressesAtom)

  const networkName = network.name
  const prizePoolAddress = poolAddresses.prizePool

  return (
    <Card className={classnames('flex flex-col mx-auto', className)}>
      <CardTitle>Current Prize</CardTitle>
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
              href={`/pools/[networkName]/[prizePoolAddress]/manage`}
              as={`/pools/${networkName}/${prizePoolAddress}/manage`}
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
  const { awards, loading } = useAwardsList()

  if (loading) {
    return (
      <div className={classnames('p-10', className)}>
        <LoadingDots />
      </div>
    )
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
    <div className={classnames('flex mx-auto my-2 sm:my-8 leading-none', className)}>
      {imageUrl && <img src={imageUrl} className='w-4 h-4 sm:w-16 sm:h-16 mr-4 my-auto' />}
      <span className='font-bold text-2xl sm:text-9xl mr-4 my-auto'>{token.formattedBalance}</span>
      <span className='font-bolt text-sm sm:text-4xl mt-auto mb-1'>{token.symbol}</span>
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
