import React from 'react'
import classnames from 'classnames'
import FeatherIcon from 'feather-icons-react'

import { Input } from 'lib/components/Input'
import { DEFAULT_INPUT_GROUP_CLASSES, DEFAULT_INPUT_LABEL_CLASSES } from 'lib/constants'

export const TextInputGroupType = Object.freeze({
  text: 'text',
  number: 'number'
})

export const TextInputGroup = (props) => {
  const {
    // Input Props
    id,
    label,
    rightLabel,
    disabled,
    // Utilities
    isError,
    isSuccess,
    large,
    unit,
    ...classAndInputProps
  } = props

  let {
    textClasses,
    roundedClasses,
    marginClasses,
    borderClasses,
    backgroundClasses,
    labelClassName,
    rightLabelClassName,
    unitsClassName,
    containerClassName,
    ...inputProps
  } = classAndInputProps

  textClasses = textClasses
    ? textClasses
    : classnames({
        'font-bold text-3xl sm:text-5xl': large,
        'text-xs xs:text-sm sm:text-xl lg:text-2xl': !large,
        'text-red-500': isError,
        'text-whitesmoke': disabled
      })

  roundedClasses = roundedClasses ? roundedClasses : 'rounded-full'

  marginClasses = marginClasses ? marginClasses : 'mb-2 lg:mb-2'

  borderClasses = borderClasses
    ? borderClasses
    : classnames('border', {
        'border-red': isError,
        'border-green-2': isSuccess,
        'border-transparent': !isError && !isSuccess,
        'hover:border-accent-3 focus-within:border-accent-3 focus-within:shadow-green': !disabled
      })

  backgroundClasses = backgroundClasses
    ? backgroundClasses
    : classnames(backgroundClasses, {
        'bg-grey': disabled
      })

  labelClassName = labelClassName
    ? labelClassName
    : classnames(DEFAULT_INPUT_LABEL_CLASSES, {
        'cursor-not-allowed font-whitesmoke': disabled,
        'text-accent-1': !disabled
      })

  rightLabelClassName = rightLabelClassName
    ? rightLabelClassName
    : classnames(DEFAULT_INPUT_LABEL_CLASSES, 'text-right', {
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
    DEFAULT_INPUT_GROUP_CLASSES,
    containerClassName,
    textClasses,
    roundedClasses,
    marginClasses,
    borderClasses,
    backgroundClasses
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
        <Input {...inputProps} id={id} disabled={disabled} />
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
