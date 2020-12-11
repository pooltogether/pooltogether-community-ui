import React from 'react'
import classnames from 'classnames'

export const Card = (props) => {
  const { children, className } = props

  return (
    <div
      className={classnames(
        'bg-default py-3 px-3 sm:py-6 sm:px-12 rounded-xl w-full mb-4 sm:mb-10 fadeIn animated',
        className
      )}
    >
      {children}
    </div>
  )
}
