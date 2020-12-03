import React, { useEffect, useState } from 'react'
import { useAtom } from 'jotai'

import { CardGrid } from 'lib/components/CardGrid'
import { erc20AwardsAtom, poolChainValuesAtom, prizePoolTypeAtom } from 'lib/components/PoolUI'
import { DEFAULT_TOKEN_PRECISION, PRIZE_POOL_TYPE } from 'lib/constants'
import { useInterval } from 'lib/hooks/useInterval'
import { calculateEstimatedPoolPrize } from 'lib/utils/calculateEstimatedPoolPrize'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

export const PoolStats = (props) => {
  const { poolChainValues } = props

  const {
    prizePeriodRemainingSeconds,
    canCompleteAward,
    ticketTotalSupply,
    ticketName,
    ticketSymbol,
    ticketCreditRateMantissa,
    ticketCreditLimitMantissa,
    sponsorshipName,
    sponsorshipSymbol,
    maxExitFeeMantissa
  } = poolChainValues

  const tokenDecimals = poolChainValues.tokenDecimals || DEFAULT_TOKEN_PRECISION
  const tokenSymbol = poolChainValues.tokenSymbol || 'TOKEN'

  const [mountedAt, setMountedAt] = useState(0)
  const [secondsToPrizeAtMount, setSecondsToPrizeAtMount] = useState(0)
  const [secondsRemainingNow, setSecondsRemainingNow] = useState('--')

  const [prizePoolType, setPrizePoolType] = useAtom(prizePoolTypeAtom)

  useEffect(() => {
    const set = () => {
      setSecondsToPrizeAtMount(parseInt(prizePeriodRemainingSeconds.toString(), 10))
      setMountedAt(parseInt(Date.now() / 1000, 10))
    }
    set()
  }, [canCompleteAward])

  useInterval(() => {
    const diffInSeconds = parseInt(Date.now() / 1000, 10) - mountedAt
    const remaining = secondsToPrizeAtMount - diffInSeconds
    setSecondsRemainingNow(remaining <= 0 ? 0 : remaining)
  }, 1000)

  const cards = [
    {
      icon: null,
      title: <>next prize (estimate)</>,
      content: <AwardCard />
    },
    {
      icon: null,
      title: <>Seconds until rewardable</>,
      content: (
        <>
          <h3>{secondsRemainingNow}</h3>
        </>
      )
    },
    {
      icon: null,
      title: <>Decimal precision</>,
      content: (
        <>
          <h3>{tokenDecimals}</h3>
        </>
      )
    },
    {
      icon: null,
      title: <>Total ticket supply</>,
      content: (
        <>
          <h3>
            {displayAmountInEther(ticketTotalSupply, {
              precision: 2,
              decimals: tokenDecimals
            })}{' '}
            {tokenSymbol}
          </h3>
        </>
      )
    },
    {
      icon: null,
      title: <>Ticket Symbol &amp; Name</>,
      content: (
        <>
          <h5>
            ${ticketSymbol}
            <br />
            <span className='text-blue'>{ticketName}</span>
          </h5>
        </>
      )
    },
    {
      icon: null,
      title: <>Ticket Credit Rate (% per second)</>,
      content: (
        <>
          <h3>{displayAmountInEther(ticketCreditRateMantissa, { precision: 10 })}</h3>
        </>
      )
    },
    {
      icon: null,
      title: <>Ticket Credit Limit</>,
      content: (
        <>
          <h3>{displayAmountInEther(ticketCreditLimitMantissa.mul(100), { precision: 2 })}%</h3>
        </>
      )
    },
    {
      icon: null,
      title: <>Sponsorship Symbol &amp; Name</>,
      content: (
        <>
          <h5>
            ${sponsorshipSymbol}
            <br />
            <span className='text-blue'>{sponsorshipName}</span>
          </h5>
        </>
      )
    },
    {
      icon: null,
      title: <>Max Exit Fee</>,
      content: (
        <>
          <h3>{displayAmountInEther(maxExitFeeMantissa.mul(100), { precision: 2 })}%</h3>
        </>
      )
    }
  ]

  return (
    <>
      <CardGrid cardGroupId='manage-pool-cards' cards={cards} />
    </>
  )
}

export const AwardCard = (props) => {
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
    <>
      {prizePoolType === PRIZE_POOL_TYPE.compound && (
        <h3>
          {displayAmountInEther(prizeEstimate, { precision: 2, decimals: tokenDecimals })}{' '}
          {tokenSymbol}
        </h3>
      )}
      {erc20Awards.length >= 1 && (
        <ul>
          {erc20Awards.map((award, index) => (
            <li key={index + award.symbol}>{`${award.symbol}: ${award.formattedBalance}`}</li>
          ))}
        </ul>
      )}
    </>
  )
}
