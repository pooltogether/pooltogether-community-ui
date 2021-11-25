import React from 'react'
import classnames from 'classnames'

import { ThemedClipSpinner } from './Loading/ThemedClipSpinner'

export const PoolCurrencyIcon = (props) => {
  const { className, noMediaQueries, sm, lg, xl, xs } = props

  const noMargin = props.noMargin || false

  let currencyIcon

  let sizeClasses = 'w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10'
  if (noMediaQueries === undefined) {
    if (xs) {
      sizeClasses = 'w-3 h-3 sm:w-5 sm:h-5 lg:w-6 lg:h-6'
    } else if (sm) {
      sizeClasses = 'w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8'
    } else if (lg) {
      sizeClasses = 'w-8 h-8 sm:w-14 sm:h-14'
    } else if (xl) {
      sizeClasses = 'w-12 h-12 sm:w-16 sm:h-16 lg:w-18 lg:h-18'
    }
  } else {
    sizeClasses = 'w-8 h-8'
  }

  const classes = classnames(sizeClasses, {
    [className]: className,
    'inline-block': !className,
    'mr-1': !noMargin
  })

  return (
    <>
      {!currencyIcon ? (
        <>
          <div className={`${classes} scale-80 text-center`}>
            <ThemedClipSpinner size='16px' />
          </div>
        </>
      ) : (
        <>
          <img src={currencyIcon} className={classes} />
        </>
      )}
    </>
  )
}
