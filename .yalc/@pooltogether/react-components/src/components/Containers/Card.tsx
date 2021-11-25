import React from 'react'
import classnames from 'classnames'

export const CardTheme = Object.freeze({
  default: 'bg-card',
  purple: 'bg-card-purple'
})

export interface CardProps {
  theme: string
  sizeClassName: string
  paddingClassName: string
  className?: string
  children?: React.ReactNode
  style?: object
  roundedClassName?: string
  backgroundClassName?: string
}

export const Card = (props: CardProps) => {
  const {
    children,
    className,
    roundedClassName,
    paddingClassName,
    sizeClassName,
    backgroundClassName,
    theme,
    style
  } = props

  return (
    <div
      className={classnames(
        roundedClassName || 'rounded-xl',
        sizeClassName,
        paddingClassName,
        backgroundClassName || theme,
        className
      )}
      style={style}
    >
      {children}
    </div>
  )
}

Card.defaultProps = {
  paddingClassName: 'p-4 xs:py-6 xs:px-8 sm:py-6 sm:px-12',
  sizeClassName: 'w-full',
  theme: CardTheme.default
}
