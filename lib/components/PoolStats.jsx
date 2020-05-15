import React, { useEffect, useState } from 'react'
import classnames from 'classnames'

import { useInterval } from 'lib/hooks/useInterval'
import { BlueLineStat } from 'lib/components/BlueLineStat'
import { EtherscanAddressLink } from 'lib/components/EtherscanAddressLink'
import { StatContainer } from 'lib/components/StatContainer'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

export const PoolStats = (props) => {
  const {
    genericChainValues,
    networkName,
    poolAddresses,
  } = props

  const [showPoolAddresses, setShowPoolAddresses] = useState(false)
  const [mountedAt, setMountedAt] = useState(0)
  const [secondsToPrizeAtMount, setSecondsToPrizeAtMount] = useState(0)
  const [secondsRemainingNow, setSecondsRemainingNow] = useState('--')

  useEffect(() => {
    const set = () => {
      setSecondsToPrizeAtMount(
        genericChainValues.remainingSecondsToPrize.toString(),
        10
      )
      setMountedAt(parseInt(Date.now() / 1000, 10))
    }
    set()
  }, [genericChainValues.canCompleteAward])

  useInterval(() => {
    const diffInSeconds = parseInt(Date.now() / 1000, 10) - mountedAt
    const remaining = secondsToPrizeAtMount - diffInSeconds
    setSecondsRemainingNow(remaining <= 0 ? 0 : remaining)
  }, 1000)

  return <>
    <div
      className={classnames(
        'flex flex-col sm:flex-row sm:flex-wrap justify-center items-center',
        'mt-2 mb-4 rounded-xl text-base sm:text-lg',
      )}
    >
      <StatContainer>
        <BlueLineStat
          title='Total ticket supply'
          value={`${displayAmountInEther(genericChainValues.ticketTotalSupply, { precision: 2 })} ${genericChainValues.erc20Symbol || 'TOKEN'}`}
        />
      </StatContainer>

      <StatContainer>
        <BlueLineStat
          title={<div className='flex flex-col leading-tight'>
            next prize
            <span className='text-purple-600 italic'>
              (estimate)
            </span></div>}
          value={`$${displayAmountInEther(genericChainValues.estimatePrize, { precision: 0 })} ${genericChainValues.erc20Symbol || 'TOKEN'}`}
        />
      </StatContainer>

      <StatContainer>
        <BlueLineStat
          title='Seconds until rewardable'
          value={secondsRemainingNow}
        />
      </StatContainer>

      <StatContainer>
        <BlueLineStat
          title='Ticket Name &amp; Symbol'
          value={`${genericChainValues.ticketSymbol}: ${genericChainValues.ticketName}`}
        />
      </StatContainer>

      <StatContainer>
        <BlueLineStat
          title='Sponsorship Name &amp; Symbol'
          value={`${genericChainValues.sponsorshipSymbol}: ${genericChainValues.sponsorshipName}`}
        />
      </StatContainer>

    </div>

    <button
      onClick={(e) => {
        e.preventDefault()
        setShowPoolAddresses(true)
      }}
      className={classnames(
        `mt-2 animated text-purple-400 hover:text-green-300 trans text-xxs sm:text-base lg:text-base no-underline hover:underline`,
         {
           'fadeOut': showPoolAddresses,
         }
      )}
    >
      Show related pool addresses
    </button>

    <div
      className={classnames(
        'flex flex-col sm:flex-row sm:flex-wrap justify-center items-center',
        'mt-2 mb-4 rounded-xl text-base sm:text-lg animated faster',
        {
          'h-0 opacity-0 pointer-events-none': !showPoolAddresses, 
          'fadeIn': showPoolAddresses,
        }
      )}
    >
      <StatContainer>
        <BlueLineStat
          title='ticket()'
          value={<>
            <EtherscanAddressLink
              address={poolAddresses.ticket}
              networkName={networkName}
              size='xxs'
            >
              {poolAddresses.ticket}
            </EtherscanAddressLink>
          </>}
        />
      </StatContainer>

      <StatContainer>
        <BlueLineStat
          title='yieldService()'
          value={<>
            <EtherscanAddressLink
              address={poolAddresses.yieldService}
              networkName={networkName}
              size='xxs'
            >
              {poolAddresses.yieldService}
            </EtherscanAddressLink>
          </>}
        />
      </StatContainer>

      <StatContainer>
        <BlueLineStat
          title='timelock()'
          value={<>
            <EtherscanAddressLink
              address={poolAddresses.timelock}
              networkName={networkName}
              size='xxs'
            >
              {poolAddresses.timelock}
            </EtherscanAddressLink>
          </>}
        />
      </StatContainer>

      <StatContainer>
        <BlueLineStat
          title='sponsorship()'
          value={<>
            <EtherscanAddressLink
              address={poolAddresses.sponsorship}
              networkName={networkName}
              size='xxs'
            >
              {poolAddresses.sponsorship}
            </EtherscanAddressLink>
          </>}
        />
      </StatContainer>

      <StatContainer>
        <BlueLineStat
          title='prizeStrategy()'
          value={<>
            <EtherscanAddressLink
              address={poolAddresses.prizeStrategy}
              networkName={networkName}
              size='xxs'
            >
              {poolAddresses.prizeStrategy}
            </EtherscanAddressLink>
          </>}
        />
      </StatContainer>

      <StatContainer>
        <BlueLineStat
          title='erc20 token()'
          value={<>
            <EtherscanAddressLink
              address={poolAddresses.erc20}
              networkName={networkName}
              size='xxs'
            >
              {poolAddresses.erc20}
            </EtherscanAddressLink>
          </>}
        />
      </StatContainer>

    </div>
    
  </>
}

