import React, { useEffect, useState } from 'react'

import { DEFAULT_TOKEN_PRECISION } from 'lib/constants'
import { useInterval } from 'lib/hooks/useInterval'
import { CardGrid } from 'lib/components/CardGrid'
import { calculateEstimatedPoolPrize } from 'lib/utils/calculateEstimatedPoolPrize'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

export const PoolStats = (props) => {
  const {
    genericChainValues,
  } = props

  const {
    awardBalance,
    prizePeriodRemainingSeconds,
    canCompleteAward,
    poolTotalSupply,
    supplyRatePerBlock,
    ticketTotalSupply,
    ticketName,
    ticketSymbol,
    ticketCreditRateMantissa,
    ticketCreditLimitMantissa,
    sponsorshipName,
    sponsorshipSymbol,
    maxExitFeeMantissa,
  } = genericChainValues

  const tokenDecimals = genericChainValues.tokenDecimals || DEFAULT_TOKEN_PRECISION
  const tokenSymbol = genericChainValues.tokenSymbol || 'TOKEN'

  const [mountedAt, setMountedAt] = useState(0)
  const [secondsToPrizeAtMount, setSecondsToPrizeAtMount] = useState(0)
  const [secondsRemainingNow, setSecondsRemainingNow] = useState('--')
  const [prizeEstimate, setPrizeEstimate] = useState(0)

  useEffect(() => {
    const set = () => {
      setSecondsToPrizeAtMount(
        parseInt(prizePeriodRemainingSeconds.toString(), 10)
      )
      setMountedAt(parseInt(Date.now() / 1000, 10))
    }
    set()
  }, [canCompleteAward])

  useEffect(() => {
    const estimatedPoolPrize = calculateEstimatedPoolPrize({
      tokenDecimals,
      awardBalance,
      poolTotalSupply,
      supplyRatePerBlock,
      prizePeriodRemainingSeconds,
    })

    setPrizeEstimate(estimatedPoolPrize)
  }, [poolTotalSupply, supplyRatePerBlock, prizePeriodRemainingSeconds, awardBalance])

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
            next prize (estimate)
          </>,
          content: <>
            <h3>
              {displayAmountInEther(
                prizeEstimate,
                { precision: 2, decimals: tokenDecimals }
              )} {tokenSymbol}
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
            Decimal precision
          </>,
          content: <>
            <h3>
              {tokenDecimals}
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
                ticketTotalSupply, {
                precision: 2,
                decimals: tokenDecimals
              }
              )} {tokenSymbol}
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
              ${ticketSymbol}
              <br /><span className='text-blue'>{ticketName}</span>
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
                ticketCreditRateMantissa,
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
              {displayAmountInEther(ticketCreditLimitMantissa.mul(100), { precision: 2 })}%
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
              ${sponsorshipSymbol}
              <br /><span className='text-blue'>{sponsorshipName}</span>
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
              {displayAmountInEther(maxExitFeeMantissa.mul(100), { precision: 2 })}%
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