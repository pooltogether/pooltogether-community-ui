import { getTimeBreakdown } from '@pooltogether/utilities'

import classNames from 'classnames'
import React, { useMemo } from 'react'

const SECONDS_PER_DAY = 86400
const EIGHT_HOURS_IN_SECONDS = 28800

export const Time = (props: { seconds: number; className?: string; hideColors?: boolean }) => {
  const { seconds, hideColors, className } = props
  const { days, hours, minutes, seconds: secs } = useMemo(() => getTimeBreakdown(seconds), [
    seconds
  ])
  const textClassName =
    seconds >= SECONDS_PER_DAY
      ? 'text-green'
      : seconds >= EIGHT_HOURS_IN_SECONDS
      ? 'text-orange'
      : 'text-red'

  return (
    <div className={classNames(className, 'flex text-sm xs:text-xs sm:text-base')}>
      <TimeUnit
        unit='day'
        amount={days}
        textClassName={textClassName}
        hideColors={hideColors}
        className='mr-2'
      />
      <TimeUnit unit='hr' amount={hours} textClassName={textClassName} hideColors={hideColors} />
      <Colon className={textClassName} />
      <TimeUnit unit='min' amount={minutes} textClassName={textClassName} hideColors={hideColors} />
      <Colon className={textClassName} />
      <TimeUnit unit='sec' amount={secs} textClassName={textClassName} hideColors={hideColors} />
    </div>
  )
}

const Colon = (props: { className?: string }) => (
  <span className={classNames(props.className, 'font-bold sm:px-1')}>:</span>
)

const TimeUnit = (props: {
  amount: number
  unit: string
  className?: string
  hideColors?: boolean
  exactDigits?: boolean
  textClassName?: string
}) => {
  const { amount, unit, exactDigits, hideColors, textClassName, className } = props

  const amounts = String(amount).split('')
  if (!exactDigits && amounts.length === 1) {
    amounts.unshift('0')
  }

  return (
    <div className={classNames(className, 'flex flex-col space-y-1')}>
      <div className='flex space-x-px'>
        {amounts.map((amount, index) => (
          <TimeDigit
            key={`${unit}-${index}`}
            amount={amount}
            className={classNames({ [textClassName]: !hideColors })}
          />
        ))}
      </div>
      <span className='uppercase opacity-60 text-inverse text-xxxs text-center'>{unit}</span>
    </div>
  )
}

TimeUnit.defaultProps = { exactDigits: false }

const TimeDigit = (props: { amount: string; className?: string }) => (
  <div className={classNames(`bg-tertiary font-bold rounded-sm px-2 py-0.5`, props.className)}>
    {props.amount}
  </div>
)
