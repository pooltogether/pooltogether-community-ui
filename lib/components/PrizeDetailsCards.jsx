import React from 'react'

import { Card, CardPrimaryText, CardTitle } from 'lib/components/Card'
import { useTimeLeftBeforePrize } from 'lib/hooks/useTimeLeftBeforePrize'
import { usePoolChainValues } from 'lib/hooks/usePoolChainValues'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

export const PrizeDetailsCards = (props) => {
  return (
    <div className='flex'>
      <TimeUntilPrizeCard />
      {/* <PlayersCard /> */}
      <TotalDeposits />
    </div>
  )
}

const TimeUntilPrizeCard = () => {
  const { days, hours, minutes, seconds } = useTimeLeftBeforePrize()

  return (
    <Card className='mr-1 sm:mr-4'>
      <CardTitle>Time to next prize</CardTitle>
      <TimeDisplay days={days} hours={hours} minutes={minutes} seconds={seconds} />
    </Card>
  )
}

const TimeDisplay = (props) => {
  const { days, hours, minutes, seconds } = props

  if (days > 0) {
    if (hours > 0) {
      return (
        <CardPrimaryText className='text-xl'>
          {days} day{days === 1 ? '' : 's'} {hours} hour{hours === 1 ? '' : 's'}
        </CardPrimaryText>
      )
    } else {
      return (
        <CardPrimaryText className='text-xl'>
          {days} day{days === 1 ? '' : 's'} {minutes} minute{minutes === 1 ? '' : 's'}
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

// const PlayersCard = () => {
// const { data: poolChainValues } = usePoolChainValues()

//   return (
//     <Card className='mx-4'>
//       <CardTitle>Unique Players</CardTitle>
//       <CardPrimaryText>{`$${poolChainValues.sponsorship.symbol}`}</CardPrimaryText>
//     </Card>
//   )
// }

const TotalDeposits = () => {
  const { data: poolChainValues } = usePoolChainValues()

  const { decimals } = poolChainValues.token
  const totalSupplyUnformatted = poolChainValues.ticket.totalSupplyUnformatted
  const totalSupply = numberWithCommas(totalSupplyUnformatted, { decimals })

  return (
    <Card className='ml-1 sm:ml-4'>
      <CardTitle>Total deposits</CardTitle>
      <CardPrimaryText>{`${totalSupply} ${poolChainValues.token.symbol}`}</CardPrimaryText>
    </Card>
  )
}
