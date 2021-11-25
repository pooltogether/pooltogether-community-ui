import React from 'react'
import classnames from 'classnames'

import { Chip } from './Containers/Chip'

const SECONDS_PER_DAY = 86400
const SECONDS_PER_WEEK = 604800

export const PrizeFrequencyChip = (props) => {
  const { prizePeriodSeconds, t, className } = props
  const isDaily = prizePeriodSeconds.toNumber() === SECONDS_PER_DAY
  const isWeekly = prizePeriodSeconds.toNumber() === SECONDS_PER_WEEK

  const dayPeriod = prizePeriodSeconds.toNumber() / SECONDS_PER_DAY

  return (
    <Chip
      bgClasses={classnames({
        'bg-accent-grey-2': isDaily,
        'bg-accent-grey-1': isWeekly,
        'bg-accent-grey-5': !isWeekly && !isDaily
      })}
      textClasses={classnames({
        'text-highlight-6': isDaily,
        'text-green': isWeekly,
        'text-inverse': !isWeekly && !isDaily
      })}
      text={getPrizeFrequencyText(t, isDaily, isWeekly, dayPeriod)}
      className={className}
    />
  )
}

const getPrizeFrequencyText = (t, isDaily, isWeekly, dayPeriod) => {
  if (isDaily) {
    return t?.('dailyPrize') || 'Daily Prize'
  } else if (isWeekly) {
    return t?.('prizeValue') || 'Weekly Prize'
  } else {
    return t?.('everyNDays', 'Every {{n}} days', { n: dayPeriod }) || 'Every {{n}} days'
  }
}
