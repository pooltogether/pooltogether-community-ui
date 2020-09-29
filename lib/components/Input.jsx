import React from 'react'
import classnames from 'classnames'
import { omit } from 'lodash'
import { isBrowser } from 'react-device-detect'

export function Input(props) {
  let {
    autoFocus,
    marginClasses,
    handleChange,
    textClasses,
    roundedClasses,
    isError,
    value,
  } = props

  const defaultClasses = 'text-white font-headline border-2 border-transparent bg-card-selected hover:bg-purple active:bg-purple focus:bg-purple trans rounded-full focus:outline-none focus:outline-none leading-none px-6 py-2 lg:py-2'

  if (roundedClasses === undefined) {
    roundedClasses = 'rounded'
  }

  if (marginClasses === undefined) {
    marginClasses = 'mb-2 lg:mb-2'
  }

  if (textClasses === undefined) {
    textClasses = 'text-xl sm:text-2xl'
  }

  const className = classnames(
    defaultClasses,
    marginClasses,
    textClasses,
    roundedClasses,
    props.className, {
    'text-red-500': isError,
  }
  )

  const newProps = omit(props, [
    'marginClasses',
    'roundedClasses',
    'textClasses',
    'isError',
    'isLight'
  ])

  return <>
    <input
      {...newProps}
      autoFocus={autoFocus && isBrowser}
      value={value}
      className={classnames(
        className,
        'w-full font-headline rounded-full focus:outline-none leading-none pl-6',
      )}
    />

  </>
}