import React from 'react'
import {
  getLegacyButtonClassNames,
  LegacyButtonClassNameProps
} from '../../utils/getLegacyButtonClassNames'

interface ButtonProps extends LegacyButtonClassNameProps {
  children: React.ReactNode
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void
  type?: 'button' | 'submit' | 'reset'
}

export function Button(props: ButtonProps) {
  const classes = getLegacyButtonClassNames(props)
  const { type, onClick, disabled, children } = props

  return (
    <button
      children={children}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    />
  )
}
