import React from 'react'
import classnames from 'classnames'

export const Chip = (props) => {
  const { className, text } = props
  let { bgClasses, textClasses } = props

  bgClasses = bgClasses || 'bg-accent-grey-5'
  textClasses = textClasses || 'text-accent-1'

  const sizeClasses = props.size || 'text-xxxxs xs:text-xxxs sm:text-xxxs lg:text-xxxs'

  const classes = classnames(
    'font-inter rounded-full text-center py-2 px-2',
    className,
    textClasses,
    bgClasses,
    sizeClasses
  )

  return (
    <div
      className={classes}
      style={{
        lineHeight: '0.35rem'
      }}
    >
      {text}
    </div>
  )
}
