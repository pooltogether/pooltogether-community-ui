import React from 'react'
import classnames from 'classnames'
import FeatherIcon from 'feather-icons-react'

import { RoundInput } from './TextInputs'
import { DEFAULT_INPUT_GROUP_CLASS_NAME, DEFAULT_INPUT_LABEL_CLASS_NAME } from '../../constants'

export const TextInputGroupType = Object.freeze({
  text: 'text',
  number: 'number'
})

export const TextInputGroup = (props) => {
  const {
    // Input Props
    Input,
    id,
    label,
    rightLabel,
    disabled,
    readOnly,
    // Utilities
    isError,
    isSuccess,
    large,
    unit,
    ...classAndInputProps
  } = props

  let {
    containerTextClassName,
    containerRoundedClassName,
    containerMarginClassName,
    containerBorderClassName,
    containerBgClassName,
    containerClassName,
    labelClassName,
    rightLabelClassName,
    unitsClassName,
    ...inputProps
  } = classAndInputProps

  containerTextClassName = containerTextClassName
    ? containerTextClassName
    : classnames({
        'font-bold text-3xl': large,
        'text-xs': !large,
        'text-red-500': isError,
        'text-whitesmoke': disabled
      })

  containerRoundedClassName = containerRoundedClassName ? containerRoundedClassName : 'rounded-full'

  containerMarginClassName = containerMarginClassName ? containerMarginClassName : 'mb-2 lg:mb-2'

  containerBorderClassName = containerBorderClassName
    ? containerBorderClassName
    : classnames('border', {
        'border-red': isError,
        'border-green-2': isSuccess,
        'border-transparent': !isError && !isSuccess,
        'hover:border-accent-3 focus-within:border-accent-3 focus-within:shadow-green': !disabled
      })

  containerBgClassName = containerBgClassName
    ? containerBgClassName
    : classnames(containerBgClassName, {
        'bg-grey': disabled,
        'bg-card': readOnly
      })

  labelClassName = labelClassName
    ? labelClassName
    : classnames(DEFAULT_INPUT_LABEL_CLASS_NAME, {
        'cursor-not-allowed font-whitesmoke': disabled,
        'text-accent-1': !disabled
      })

  rightLabelClassName = rightLabelClassName
    ? rightLabelClassName
    : classnames(DEFAULT_INPUT_LABEL_CLASS_NAME, 'text-right', {
        'cursor-not-allowed font-whitesmoke': disabled,
        'text-accent-1': !disabled
      })

  unitsClassName = unitsClassName
    ? unitsClassName
    : classnames('font-bold text-xs sm:text-sm whitespace-no-wrap', {
        'cursor-not-allowed font-whitesmoke': disabled,
        'font-white': !disabled
      })

  containerClassName = classnames(
    DEFAULT_INPUT_GROUP_CLASS_NAME,
    containerClassName,
    containerTextClassName,
    containerRoundedClassName,
    containerMarginClassName,
    containerBgClassName
  )

  let icon, iconColor
  if (isSuccess) {
    icon = 'check-circle'
    iconColor = 'stroke-current text-green-2'
  } else if (isError) {
    icon = 'slash'
    iconColor = 'stroke-current text-red'
  }

  return (
    <div className={containerClassName}>
      <div
        className={classnames('flex flex-row', {
          'justify-between': rightLabel && label,
          'justify-end': rightLabel && !label
        })}
      >
        {label && (
          <label htmlFor={id} className={labelClassName}>
            {label}
          </label>
        )}
        {rightLabel && <span className={rightLabelClassName}>{rightLabel}</span>}
      </div>
      <div className='flex justify-between'>
        <Input {...inputProps} id={id} disabled={disabled} readOnly={readOnly} />
        {(unit || icon) && (
          <div className='pl-1 sm:pl-2'>
            {unit && <span className={unitsClassName}>{unit}</span>}
            {icon && <FeatherIcon icon={icon} className={classnames('w-4 sm:w-8', iconColor)} />}
          </div>
        )}
      </div>
    </div>
  )
}

TextInputGroup.defaultProps = {
  Input: RoundInput,
  type: TextInputGroupType.text
}

export const RightLabelButton = (props) => {
  const { onClick, children } = props
  return (
    <button type='button' onClick={onClick} className='hover:text-accent-3 trans'>
      {children}
    </button>
  )
}
