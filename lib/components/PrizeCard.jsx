import React from 'react'
import { useAtom } from 'jotai'
import FeatherIcon from 'feather-icons-react'
import classnames from 'classnames'
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
import { InternalLink } from 'lib/components/InternalLink'
import { poolChainValuesAtom } from 'lib/hooks/usePoolChainValues'
import { usersAddressAtom } from 'lib/hooks/useUsersAddress'

import Cactus from 'assets/images/cactus.svg'

export const PrizeCard = (props) => {
  const { showLinks, className } = props
  const [network] = useAtom(networkAtom)
  const [poolAddresses] = useAtom(poolAddressesAtom)
  const [poolChainValues] = useAtom(poolChainValuesAtom)
  const [usersAddress] = useAtom(usersAddressAtom)

  const networkName = network.name
  const prizePoolAddress = poolAddresses.prizePool
  const owner = poolChainValues.owner
  const userIsOwner = owner.toLowerCase() === usersAddress.toLowerCase()

  return (
    <Card className={classnames('flex flex-col mx-auto', className)}>
      <PrizeSection />
      <NewPrizeCountdown center />
      {showLinks && (
        <div className='flex flex-col mt-4 sm:mt-8 w-3/4 sm:w-2/4 mx-auto'>
          <Button
            href={`/pools/[networkName]/[prizePoolAddress]/home`}
            as={`/pools/${networkName}/${prizePoolAddress}/home`}
            size='3xl'
            color='primary'
            fullWidth
          >
            Deposit to win
          </Button>
          <div
            className={classnames('flex mt-4', {
              'justify-between': userIsOwner,
              'justify-center': !userIsOwner
            })}
          >
            {userIsOwner && (
              <InternalLink
                href={`/pools/[networkName]/[prizePoolAddress]/manage`}
                as={`/pools/${networkName}/${prizePoolAddress}/manage`}
              >
                Manage pool{' '}
                <FeatherIcon
                  icon='settings'
                  strokeWidth='0.25rem'
                  className={'ml-3 my-auto w-4 h-4 stroke-2 stroke-current'}
                />
              </InternalLink>
            )}
            <InternalLink
              href={`/pools/[networkName]/[prizePoolAddress]/home`}
              as={`/pools/${networkName}/${prizePoolAddress}/home`}
            >
              My Account{' '}
              <FeatherIcon
                icon='arrow-right'
                strokeWidth='0.25rem'
                className={'ml-3 my-auto w-4 h-4 stroke-2 stroke-current'}
              />
            </InternalLink>
          </div>
        </div>
      )}
    </Card>
  )
}

const PrizeSection = (props) => {
  const { awards, loading } = useAwardsList()

  if (loading) {
    return (
      <div className={'p-10'}>
        <LoadingDots />
      </div>
    )
  }

  if (awards.length === 0) {
    return (
      <>
        <CardTitle className='text-center mb-2 font-bold'>
          No prize data available at the moment
        </CardTitle>
        <CardTitle className='text-center'>
          We're growing new prizes worth winning for you.
        </CardTitle>
        <CardTitle className='text-center mb-8'>Check back on us soon!</CardTitle>
        <img
          alt='image of a cactus'
          src={Cactus}
          className='mx-auto w-8 h-8 sm:w-32 sm:h-32 mb-4 sm:mb-8'
        />
      </>
    )
  }

  return (
    <>
      {' '}
      <CardTitle className='text-center'>Current Prize</CardTitle>
      <Prizes />
    </>
  )
}

const Prizes = (props) => {
  const { awards, loading } = useAwardsList()

  if (awards.length === 1) {
    return <SinglePrizeItem token={awards[0]} />
  }

  return (
    <ul
      className='flex flex-col my-2 sm:my-8 max-w-xs mx-auto overflow-auto'
      style={{ maxHeight: '160px', minWidth: '230px' }}
    >
      {awards.map((token, index) => {
        if (token.formattedBalance == 0) return null
        return <PrizeListItem key={index} token={token} index={index} />
      })}
    </ul>
  )
}

const SinglePrizeItem = (props) => {
  const { token } = props
  const [coinGeckoTokenIds] = useAtom(coinGeckoTokenIdsAtom)
  const tokenId = coinGeckoTokenIds[getCoinGeckoId(token)]
  const { data } = useQuery(tokenId, async () => getCoinGeckoTokenData(tokenId))
  const imageUrl = data?.data?.image?.small

  return (
    <div className={'flex mx-auto my-2 sm:my-8 leading-none'}>
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
      <li key={index + token.symbol} className='flex w-full justify-between mb-2'>
        <span className='font-bold'>{token.formattedBalance}</span>
        <div className='flex ml-4'>
          <img className='my-auto mr-2 w-6 h-6' src={imageUrl} />
          {token.name || token.symbol}
        </div>
      </li>
    )
  }

  return (
    <li key={index + token.symbol} className='flex justify-between mb-2'>
      <span className='font-bold'>{token.formattedBalance}</span>
      <div className='flex ml-4'>{token.name || token.symbol}</div>
    </li>
  )
}
