import React from 'react'
import classnames from 'classnames'
import { isBrowser } from 'react-device-detect'

import { DEFAULT_INPUT_CLASS_NAME } from '../../constants'

const sanitizeProps = (props) => {
  const {
    alignLeft,
    label,
    small,
    large,
    marginClassName,
    paddingClassName,
    borderClassName,
    bgClassName,
    inlineButton,
    roundedClassName,
    textClassName,
    isError,
    isLight,
    register,
    required,
    pattern,
    validate,
    unsignedNumber,
    unsignedWholeNumber,
    rightLabel,
    bottomRightLabel,
    ...sanitizedProps
  } = props
  return sanitizedProps
}

const collectClassNames = (props) => {
  return classnames(
    DEFAULT_INPUT_CLASS_NAME,
    props.marginClassName,
    props.paddingClassName,
    props.borderClassName,
    props.bgClassName,
    props.textClassName,
    props.roundedClassName,
    props.className,
    {
      'text-red': props.isError
    }
  )
}

export const SimpleInput = (props) => {
  const { autoFocus, value, ...inputProps } = props

  return (
    <input
      {...inputProps}
      autoFocus={autoFocus && isBrowser}
      value={value}
      className={DEFAULT_INPUT_CLASS_NAME}
    />
  )
}

export const RoundInput = (props) => {
  let { autoFocus, pattern, required, register, validate } = props

  const className = collectClassNames(props)

  return (
    <input
      {...sanitizeProps(props)}
      autoFocus={autoFocus && isBrowser}
      ref={register({
        required,
        pattern,
        validate
      })}
      className={classnames(className, 'focus:outline-none')}
    />
  )
}

RoundInput.defaultProps = {
  marginClassName: '',
  paddingClassName: 'px-8 py-3',
  borderClassName: 'border border-accent-3',
  bgClassName: 'bg-input',
  textClassName: 'text-xs',
  roundedClassName: 'rounded-full'
}

export const RectangularInput = (props) => {
  let { autoFocus, pattern, required, register, validate } = props

  const className = collectClassNames(props)

  return (
    <div className='relative'>
      <div className='absolute' style={{ top: 10, bottom: 10, left: 10 }}>
        PRZUSDC
      </div>
      <input
        {...sanitizeProps(props)}
        autoFocus={autoFocus && isBrowser}
        ref={register({
          required,
          pattern,
          validate
        })}
        className={classnames(className, 'focus:outline-none')}
      />
    </div>
  )
}

RectangularInput.defaultProps = {
  marginClassName: '',
  paddingClassName: 'px-8 py-3',
  borderClassName: 'border-2 border-accent-3',
  bgClassName: 'bg-transparent',
  textClassName: 'text-xs text-right',
  roundedClassName: 'rounded-lg'
}
