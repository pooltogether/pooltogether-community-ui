import React, { useState } from 'react'
import { addSeconds } from 'date-fns'
import { useAtom } from 'jotai'

import { Card, CardPrimaryText, CardTitle } from 'lib/components/Card'
import { useInterval } from 'lib/hooks/useInterval'
import { poolChainValuesAtom } from 'lib/hooks/usePoolChainValues'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { subtractDates } from 'lib/utils/subtractDates'

export const PrizeDetailsCards = (props) => {
  return (
    <div className='flex'>
      <TimeUntilPrizeCard />
      <PlayersCard />
      <TotalDeposits />
    </div>
  )
}

const TimeUntilPrizeCard = () => {
  const [poolChainValues] = useAtom(poolChainValuesAtom)
  const [secondsLeft, setSecondsLeft] = useState(
    parseInt(poolChainValues.prizePeriodRemainingSeconds.toString(), 10)
  )

  useInterval(() => {
    const newRemainder = secondsLeft - 1
    if (newRemainder > 0) {
      setSecondsLeft(newRemainder)
    }
  }, 1000)

  const currentDate = new Date(Date.now())
  const futureDate = addSeconds(currentDate, secondsLeft)
  const { days, hours, minutes, seconds } = subtractDates(futureDate, currentDate)

  return (
    <Card className='mr-4'>
      <CardTitle>Time to next prize</CardTitle>
      <TimeDisplay days={days} hours={hours} minutes={minutes} seconds={seconds} />
    </Card>
  )
}

const TimeDisplay = (props) => {
  const { days, hours, minutes, seconds } = props
  console.log(days, hours, minutes, seconds)

  if (days > 0) {
    if (hours > 0) {
      return (
        <CardPrimaryText className='text-xl'>
          {days} days {hours} hours
        </CardPrimaryText>
      )
    } else {
      return (
        <CardPrimaryText className='text-xl'>
          {days} days {minutes} minutes
        </CardPrimaryText>
      )
    }
  }

  return (
    <CardPrimaryText>
      {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:
      {String(seconds).padStart(2, '0')}
    </CardPrimaryText>
  )
}

const PlayersCard = () => {
  const [poolChainValues] = useAtom(poolChainValuesAtom)

  return (
    <Card className='mx-4'>
      <CardTitle>Unique Players</CardTitle>
      <CardPrimaryText>{`$${poolChainValues.sponsorshipSymbol}`}</CardPrimaryText>
    </Card>
  )
}

const TotalDeposits = () => {
  const [poolChainValues] = useAtom(poolChainValuesAtom)
  const total = displayAmountInEther(poolChainValues.poolTotalSupply, poolChainValues.tokenDecimals)

  return (
    <Card className='mr-4'>
      <CardTitle>Total deposits</CardTitle>
      <CardPrimaryText>{`${total} ${poolChainValues.tokenSymbol}`}</CardPrimaryText>
    </Card>
  )
}
