import React from 'react'
import classnames from 'classnames'
import Link from 'next/link'
import { pick, isUndefined } from 'lodash'

const COLOR_CLASSES = {
  primary: {
    backgroundClasses: 'bg-green-400 hover:bg-opacity-80',
    borderClasses: 'border border-green-1 active:shadow-green focus:shadow-green',
    textColorClasses: 'text-primary'
  },
  secondary: {
    backgroundClasses: 'bg-green-400 bg-opacity-0 hover:bg-opacity-15 active:bg-opacity-15',
    borderClasses: 'border border-green-1 active:shadow-green focus:shadow-green',
    textColorClasses: 'text-highlight-2'
  },
  tertiary: {
    backgroundClasses:
      'bg-green-400 bg-opacity-0 hover:bg-opacity-15 focus:bg-opacity-15 active:bg-opacity-15',
    borderClasses: 'border border-transparent',
    textColorClasses: 'text-highlight-2'
  },
  danger: {
    backgroundClasses: 'bg-transparent',
    borderClasses:
      'border border-red-600 hover:border-red-700 focus:border-red-700 active:shadow-red',
    textColorClasses:
      'text-red-600 hover:text-red-700 focus:text-red-700 active:shadow-red focus:shadow-red'
  },
  warning: {
    backgroundClasses: 'bg-transparent',
    borderClasses:
      'border border-orange-500 hover:border-orange-600 focus:border-orange-600 active:shadow-orange',
    textColorClasses:
      'text-orange-500 hover:text-orange-600 focus:text-orange-600 active:shadow-orange focus:shadow-orange'
  },
  text_warning: {
    backgroundClasses:
      'bg-orange-500 bg-opacity-0 hover:bg-opacity-15 focus:bg-opacity-15 active:bg-opacity-15',
    borderClasses: 'border border-transparent',
    textColorClasses: 'text-orange-500'
  },
  disabled: {
    backgroundClasses: 'bg-transparent',
    borderClasses: 'border border-gray-400 focus:border-gray-400',
    textColorClasses: 'text-gray-400 focus:shadow-gray'
  }
}

export function getButtonClasses(props) {
  let {
    color,
    className,
    disabled,
    paddingClasses,
    roundedClasses,
    size,
    textSizeClasses,
    transitionClasses,
    fullWidth,
    noPad
  } = props

  let defaultClasses =
    'inline-block text-center leading-snug tracking-wide outline-none focus:outline-none active:outline-none font-bold '

  if (fullWidth) {
    defaultClasses += 'w-full'
  } else {
    defaultClasses += 'width-max-content'
  }

  const { backgroundClasses, borderClasses, textColorClasses } = getColorClasses(color, disabled)
  paddingClasses = getPaddingClasses(paddingClasses, noPad)
  roundedClasses = getRoundedClasses(roundedClasses)
  textSizeClasses = getTextSizeClasses(textSizeClasses, size)
  transitionClasses = getTransitionClasses(transitionClasses)
  let cursorClasses = getCursorClasses(disabled)

  return classnames(
    backgroundClasses,
    borderClasses,
    textColorClasses,
    defaultClasses,
    paddingClasses,
    roundedClasses,
    size,
    textSizeClasses,
    transitionClasses,
    cursorClasses,
    className
  )
}

const getColorClasses = (color, disabled) => {
  if (disabled) {
    return COLOR_CLASSES.disabled
  }

  switch (color) {
    case 'primary': {
      return COLOR_CLASSES.primary
    }
    case 'secondary': {
      return COLOR_CLASSES.secondary
    }
    case 'tertiary': {
      return COLOR_CLASSES.tertiary
    }
    case 'danger': {
      return COLOR_CLASSES.danger
    }
    case 'warning': {
      return COLOR_CLASSES.warning
    }
    case 'text_warning': {
      return COLOR_CLASSES.text_warning
    }
    default: {
      return COLOR_CLASSES.primary
    }
  }
}

const getCursorClasses = (disabled) => {
  if (disabled) {
    return 'cursor-not-allowed'
  }
  return 'cursor-pointer'
}

const getPaddingClasses = (paddingClasses, noPad) => {
  if (noPad) {
    return ''
  }

  if (paddingClasses) {
    return paddingClasses
  }

  return 'py-1 px-6 sm:py-2 sm:px-10'
}

const getTextSizeClasses = (textSizeClasses, size) => {
  if (textSizeClasses) {
    return textSizeClasses
  }

  switch (size) {
    case 'xs':
      return `text-xxs sm:text-xs lg:text-sm`
    case 'sm':
      return `text-xs sm:text-sm lg:text-base`
    case 'base':
      return `text-sm sm:text-base lg:text-lg`
    case 'lg':
      return `text-base sm:text-lg lg:text-xl`
    case 'xl':
      return `text-lg sm:text-xl lg:text-2xl`
    case '2xl':
      return `text-xl sm:text-2xl lg:text-3xl`
    case '3xl':
      return `text-xl sm:text-3xl lg:text-4xl`
    default:
      return `text-sm sm:text-base lg:text-lg`
  }
}

const getTransitionClasses = (transitionClasses) => {
  return transitionClasses || 'trans trans-fast'
}

const getRoundedClasses = (roundedClasses) => {
  return roundedClasses || 'rounded-full'
}

export function ButtonLink(props) {
  let { children, as, href } = props

  const classes = getButtonClasses(props)

  const linkProps = pick(props, ['target', 'rel'])

  if (!as) {
    return (
      <a {...linkProps} href={href} className={classes} onClick={(e) => e.stopPropagation()}>
        {children}
      </a>
    )
  } else {
    return (
      <Link href={href} as={as} scroll={false}>
        <a {...linkProps} className={classes} onClick={(e) => e.stopPropagation()}>
          {children}
        </a>
      </Link>
    )
  }
}
