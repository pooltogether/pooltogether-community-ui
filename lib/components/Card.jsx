import React from 'react'
import classnames from 'classnames'

export const Card = (props) => {
  const { children, className } = props
  
  const paddingClasses = props.small ? 'py-6 px-3' : 'py-3 px-3 sm:py-6 sm:px-12'

  return (
    <div
      className={classnames(
        'bg-default rounded-xl w-full mb-4 sm:mb-10 fadeIn animated',
        paddingClasses,
        className
      )}
    >
      {children}
    </div>
  )
}

export const InnerCard = (props) => (
  <div
    className={classnames(
      'mx-auto py-2 px-8 sm:py-4 sm:px-12 bg-purple-800 bg-opacity-20 rounded-xl width-fit-content',
      props.className
    )}
  >
    {props.children}
  </div>
)

export const CardTitle = (props) => (
  <div className={classnames('text-sm sm:text-base text-accent-1 text-center', props.className)}>
    {props.children}
  </div>
)

export const CardPrimaryText = (props) => {
  const textClasses = props.small ? 'text-xs sm:text-xl' : 'text-base sm:text-4xl'

  return <div
    className={classnames('flex items-center justify-center py-2 leading-none font-bold text-white', props.className, textClasses, {
      'text-center': props.center
    })}
  >
    {props.children}
  </div>
}

CardPrimaryText.defaultProps = {
  center: true
}

export const CardSecondaryText = (props) => (
  <div className={classnames('text-xs sm:text-sm text-accent-1', props.className)}>
    {props.children}
  </div>
)
