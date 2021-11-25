import React from 'react'
import classnames from 'classnames'

export function CountBadge(props) {
  const { title, textClassName, bgClassName, count, sizeClassName, className } = props

  return (
    <span
      title={title}
      className={classnames(
        'trans rounded-full flex flex-col items-center justify-center font-bold tracking-tight leading-none',
        sizeClassName,
        bgClassName,
        textClassName,
        className
      )}
    >
      <span className='relative'>{count}</span>
    </span>
  )
}

CountBadge.defaultProps = {
  bgClassName: 'bg-blue',
  sizeClassName: 'w-5 h-5 text-xxxs',
  textClassName: 'text-white'
}
