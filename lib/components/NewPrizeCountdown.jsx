import React, { useEffect, useState } from 'react'
import classnames from 'classnames'
import addSeconds from 'date-fns/addSeconds'
import { useInterval } from 'beautiful-react-hooks'

import { subtractDates } from 'lib/utils/subtractDates'
import { useAtom } from 'jotai'
import { poolChainValuesAtom } from 'lib/hooks/usePoolChainValues'

const ONE_SECOND = 1000

export const NewPrizeCountdown = (props) => {
  const { center, textAlign, textSize } = props
  const [poolChainValues] = useAtom(poolChainValuesAtom)

  let flashy = props.flashy === false ? false : true

  const [secondsRemaining, setSecondsRemaining] = useState(null)

  const secs =
    poolChainValues?.prizePeriodRemainingSeconds &&
    parseInt(poolChainValues?.prizePeriodRemainingSeconds.toString(), 10)

  useEffect(() => {
    setSecondsRemaining(secs)
  }, [secs])

  useInterval(() => {
    setSecondsRemaining(secondsRemaining - 1)
  }, ONE_SECOND)

  if (!poolChainValues || secs === undefined) {
    return null
  }

  const currentDate = new Date(Date.now())
  const futureDate = addSeconds(currentDate, secondsRemaining)
  const { days, hours, minutes, seconds } = subtractDates(futureDate, currentDate)

  let msg
  if (poolChainValues?.isRngRequested) {
    return (
      <p
        className={classnames(textSize, 'font-bold', {
          'text-flashy': flashy,
          'text-xs xs:text-sm sm:text-xl lg:text-2xl': !textSize,
          'text-right': !textAlign,
          'mx-auto': center
        })}
      >
        Prize is being awarded
      </p>
    )
  }

  const daysArray = ('' + days).split('')
  const hoursArray = ('' + hours).split('')
  const minutesArray = ('' + minutes).split('')
  const secondsArray = ('' + seconds).split('')

  // 86400 seconds = 1 day
  // 3600 seconds = 1 hour
  const textColor = secondsRemaining >= 86400 ?
    'green-1' :
    secondsRemaining >= 3600 ?
      'yellow-1' :
      'red-1'

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

  return (
    <div
      className={classnames(textSize, 'flex text-center', {
        'justify-center': center,
        'text-base sm:text-xl': !textSize
      })}
    >
      <div
        className='flex flex-col sm:mr-2'
        style={{
          paddingLeft: 2,
          paddingRight: 2
        }}
      >
        <div className='flex'>
          <LeftSideJsx digit={daysArray.length < 2 ? 0 : daysArray[0]} />
          <RightSideJsx digit={daysArray.length > 1 ? daysArray[1] : daysArray[0]} />
        </div>
        <div className='text-caption text-xs sm:text-base'>DAY</div>
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
        <div className='text-caption text-xs sm:text-base'>HR</div>
      </div>
      <div className={`text-${textColor} px-0 sm:px-1`}>:</div>
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
        <div className='text-caption text-xs sm:text-base'>MIN</div>
      </div>
      <div className={`text-${textColor} px-0 sm:px-1`}>:</div>
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
        <div className='text-caption text-xs sm:text-base'>SEC</div>
      </div>
      {msg}
    </div>
  )
}
