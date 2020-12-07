import React, { useEffect, useState } from 'react'
import classnames from 'classnames'
import CountUp from 'react-countup'
import { usePreviousValue } from 'beautiful-react-hooks'

export function PoolCountUp (props) {
  const { bold, children, duration, fontSansRegular } = props

  let end = props.end
  if (children) {
    end = children

    if (Array.isArray(end)) {
      end = end[0]
    }
    end = parseFloat(end)
  }

  // The CountUp library only works with floats and ints, not strings
  if (typeof props.start === 'string' || typeof end === 'string') {
    console.warn('PoolCountUp exiting early on values:')
    console.warn('start:', props.start)
    console.warn('end:', end)
    return end
  }

  let [value, setValue] = useState(0)
  let prev = usePreviousValue(value)
  useEffect(() => {
    setValue(end)
  }, [end])

  let fontBold = bold === undefined ? true : false

  let decimalsToUse = Number(props.decimals)
  if (isNaN(decimalsToUse)) {
    decimalsToUse = 2
  }

  // TODO: Replace this! What we need is a clever formatter (maybe the one from v2)
  // that only shows the # of decimals necessary
  if (decimalsToUse === 0) {
    prev = parseInt(prev, 10)
    value = parseInt(value, 10)
  }

  return (
    <>
      <span
        className={classnames({
          'font-sans': fontSansRegular,
          'font-mono': !fontSansRegular,
          'font-bold': fontBold
        })}
      >
        <CountUp
          start={prev || 0}
          end={value}
          duration={duration || 1.4}
          separator={','}
          decimals={decimalsToUse}
          // onEnd={() => console.log('Ended! 👏')}
          // onStart={() => console.log('Started! 💨')}
        />
      </span>
    </>
  )
}
