import React from 'react'
import classnames from 'classnames'
import { SECONDS_PER_DAY } from '@pooltogether/current-pool-data'
import { usePrizePeriodTimeLeft } from '@pooltogether/hooks'

const EIGHT_HOURS_IN_SECONDS = 28800

export const PrizeCountdown = (props) => {
  const { t } = props

  const {
    center,
    textAlign,
    textSize,
    prizePeriodSeconds,
    prizePeriodStartedAt,
    isRngRequested,
    canStartAward,
    canCompleteAward,
    className
  } = props
  let flashy = props.flashy === false ? false : true

  const { days, hours, minutes, seconds, secondsLeft } = usePrizePeriodTimeLeft(
    prizePeriodSeconds,
    prizePeriodStartedAt
  )

  if (isRngRequested || canStartAward || canCompleteAward) {
    let message = t?.('prizeIsBeingAwarded') || 'Prize is being awarded'

    if (canStartAward) {
      message = t?.('prizeCanBeAwarded') || 'Prize can be awarded'
    }

    return (
      <p
        className={classnames(textSize, className, 'font-bold', {
          'text-flashy': flashy,
          'text-xs xs:text-sm sm:text-xl': !textSize,
          'text-right': !textAlign
        })}
      >
        {message}
      </p>
    )
  }

  const daysArray = ('' + days).split('')
  const hoursArray = ('' + hours).split('')
  const minutesArray = ('' + minutes).split('')
  const secondsArray = ('' + seconds).split('')

  const textColor =
    secondsLeft >= SECONDS_PER_DAY
      ? 'green'
      : secondsLeft >= EIGHT_HOURS_IN_SECONDS
      ? 'orange'
      : 'red'

  const LeftSideJsx = ({ digit }) => {
    return (
      <span
        className={`bg-tertiary text-${textColor} font-bold rounded-sm`}
        style={{
          padding: '2px 8px',
          margin: '0 1px'
        }}
      >
        {digit}
      </span>
    )
  }

  const RightSideJsx = ({ digit }) => {
    return (
      <span
        className={`bg-tertiary text-${textColor} font-bold rounded-sm`}
        style={{
          padding: '2px 8px',
          margin: '0 1px'
        }}
      >
        {digit}
      </span>
    )
  }

  const unitClasses = 'opacity-60 text-inverse text-xxxs'
  const unitStyles = { paddingTop: 3 }

  return (
    <>
      <div
        className={classnames(textSize, className, 'flex text-center', {
          'justify-center': center,
          'text-sm xs:text-xs sm:text-base': !textSize
        })}
      >
        <div
          className='flex flex-col mr-4'
          style={{
            paddingLeft: 2,
            paddingRight: 2
          }}
        >
          <div className='flex'>
            <LeftSideJsx digit={daysArray.length < 2 ? 0 : daysArray[0]} />
            <RightSideJsx digit={daysArray.length > 1 ? daysArray[1] : daysArray[0]} />
          </div>
          <div className={unitClasses} style={unitStyles}>
            {t?.('countdownDayShort') || 'DAY'}
          </div>
        </div>
        <div
          className='flex flex-col'
          style={{
            paddingLeft: 2,
            paddingRight: 2
          }}
        >
          <div className='flex'>
            <LeftSideJsx digit={hoursArray.length < 2 ? 0 : hoursArray[0]} />
            <RightSideJsx digit={hoursArray.length > 1 ? hoursArray[1] : hoursArray[0]} />
          </div>
          <div className={unitClasses} style={unitStyles}>
            {t?.('countdownHourShort') || 'HR'}
          </div>
        </div>
        <div className={`px-0 sm:px-1 font-bold text-${textColor}`}>:</div>
        <div
          className='flex flex-col'
          style={{
            paddingLeft: 1,
            paddingRight: 2
          }}
        >
          <div className='flex'>
            <LeftSideJsx digit={minutesArray.length < 2 ? 0 : minutesArray[0]} />
            <RightSideJsx digit={minutesArray.length > 1 ? minutesArray[1] : minutesArray[0]} />
          </div>
          <div className={unitClasses} style={unitStyles}>
            {t?.('countdownMinuteShort') || 'MIN'}
          </div>
        </div>
        <div className={`px-0 sm:px-1 font-bold text-${textColor}`}>:</div>
        <div
          className='flex flex-col'
          style={{
            paddingLeft: 1,
            paddingRight: 2
          }}
        >
          <div className='flex'>
            <LeftSideJsx digit={secondsArray.length < 2 ? 0 : secondsArray[0]} />
            <RightSideJsx digit={secondsArray.length > 1 ? secondsArray[1] : secondsArray[0]} />
          </div>
          <div className={unitClasses} style={unitStyles}>
            {t?.('countdownSecondShort') || 'SEC'}
          </div>
        </div>
      </div>
    </>
  )
}
