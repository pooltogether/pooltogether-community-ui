import React, { useEffect, useState } from 'react'
import classnames from 'classnames'

import { useInterval } from 'lib/hooks/useInterval'
import { BlueLineStat } from 'lib/components/BlueLineStat'
import { StatContainer } from 'lib/components/StatContainer'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

export const PoolStats = (props) => {
  const {
    genericChainValues,
  } = props

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
    
  </>
}

