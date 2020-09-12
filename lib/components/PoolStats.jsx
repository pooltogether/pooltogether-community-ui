import React, { useEffect, useState } from 'react'
import classnames from 'classnames'

import { useInterval } from 'lib/hooks/useInterval'
import { BlueLineStat } from 'lib/components/BlueLineStat'
import { CardGrid } from 'lib/components/CardGrid'
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
        parseInt(genericChainValues.prizePeriodRemainingSeconds.toString(), 10)
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
    <CardGrid
      cardGroupId='manage-pool-cards'
      cards={[
        {
          icon: null,
          title: <>
            Decimal precision
          </>,
          content: <>
            <h3>
              {genericChainValues.tokenDecimals || '18'}
            </h3>
          </>
        },
        {
          icon: null,
          title: <>
            Total ticket supply
          </>,
          content: <>
            <h3>
              {displayAmountInEther(
                genericChainValues.ticketTotalSupply, { precision: 2, decimals: genericChainValues.tokenDecimals }
              )} {genericChainValues.tokenSymbol || 'TOKEN'}
            </h3>
          </>
        },
        {
          icon: null,
          title: <>
            next prize (estimate)
          </>,
          content: <>
            <h3>
              {displayAmountInEther(
                genericChainValues.estimateRemainingPrize,
                { precision: 0 }
              )} {genericChainValues.tokenSymbol || 'TOKEN'}
            </h3>
          </>
        },
        {
          icon: null,
          title: <>
            Seconds until rewardable
          </>,
          content: <>
            <h3>
              {secondsRemainingNow}
            </h3>
          </>
        },
        {
          icon: null,
          title: <>
            Ticket Symbol &amp; Name
          </>,
          content: <>
            <h5>
              ${genericChainValues.ticketSymbol}
              <br /><span className='text-blue'>{genericChainValues.ticketName}</span>
            </h5>
          </>
        },
        {
          icon: null,
          title: <>
            Ticket Credit Rate (% per second)
          </>,
          content: <>
            <h3>
              {displayAmountInEther(
                genericChainValues.ticketCreditRateMantissa,
                { precision: 10 }
              )}
            </h3>
          </>
        },
        {
          icon: null,
          title: <>
            Ticket Credit Limit
          </>,
          content: <>
            <h3>
              {displayAmountInEther(genericChainValues.ticketCreditLimitMantissa.mul(100), { precision: 2 })}%
            </h3>
          </>
        },
        {
          icon: null,
          title: <>
            Sponsorship Symbol &amp; Name
          </>,
          content: <>
            <h5>
              ${genericChainValues.sponsorshipSymbol}
              <br /><span className='text-blue'>{genericChainValues.sponsorshipName}</span>
            </h5>
          </>
        },
        {
          icon: null,
          title: <>
            Max Exit Fee
          </>,
          content: <>
            <h3>
              {displayAmountInEther(genericChainValues.maxExitFeeMantissa.mul(100), { precision: 2 })}%
            </h3>
          </>
        },
        
      ]}
    />


  </>
}



// (<a
//   href='https://docs.pooltogether.com/tutorials/withdrawing-from-a-prize-pool#withdrawing-funds-instantly'
//   target='_blank'
//   rel='noreferrer nofollow'
// >exitFeeMantissa</a>)

// (<a
//   href='https://docs.pooltogether.com/tutorials/withdrawing-from-a-prize-pool#withdrawing-funds-instantly'
//   target='_blank'
//   rel='noreferrer nofollow'
// >creditRateMantissa</a>)