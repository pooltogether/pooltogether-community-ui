import React, { useState } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems, MenuPopover } from '@reach/menu-button'
import { positionMatchWidth } from '@reach/popover'
import classnames from 'classnames'
import FeatherIcon from 'feather-icons-react'

import { DEFAULT_INPUT_GROUP_CLASSES, DEFAULT_INPUT_LABEL_CLASSES } from 'lib/constants'

export const DropdownInputGroup = (props) => {
  const { id, formatValue, label, placeHolder, values, current, onValueSet, disabled } = props

  const [currentValue, setCurrentValue] = useState(current ? current : '')

  const handleChangeValueClick = (newValue) => {
    setCurrentValue(newValue)
    onValueSet(newValue)
  }

  let valuesArray = []
  if (typeof values === 'object') {
    valuesArray = Object.keys(values).map((v) => v)
  }

  const menuItems = valuesArray.map((valueItem) => {
    let value = valueItem

    const selected = value === currentValue

    return (
      <MenuItem
        key={`${id}-value-picker-item-${value}`}
        onSelect={() => {
          handleChangeValueClick(value)
        }}
        className={classnames({
          selected
        })}
      >
        {formatValue ? formatValue(value) : value}
      </MenuItem>
    )
  })

  // Styling

  let {
    textClasses,
    roundedClasses,
    marginClasses,
    borderClasses,
    backgroundClasses,
    labelClassName,
    unitsClassName,
    containerClassName,
    isError,
    isSuccess
  } = props

  textClasses = textClasses
    ? textClasses
    : classnames('text-xs xs:text-sm sm:text-xl lg:text-2xl trans', {
        'text-whitesmoke': disabled || !currentValue
      })

  containerClassName = containerClassName ? containerClassName : 'w-full'

  roundedClasses = roundedClasses ? roundedClasses : 'rounded-full'

  marginClasses = marginClasses ? marginClasses : 'mb-2 lg:mb-2'

  borderClasses = borderClasses
    ? borderClasses
    : classnames('border', {
        'border-red-1': isError,
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
        'cursor-not-allowed opacity-30': disabled,
        'text-accent-1': !disabled
      })

  unitsClassName = unitsClassName
    ? unitsClassName
    : classnames('font-bold text-xs sm:text-sm whitespace-no-wrap', {
        'cursor-not-allowed opacity-30': disabled,
        'font-white': !disabled
      })

  const className = classnames(
    DEFAULT_INPUT_GROUP_CLASSES,
    containerClassName,
    textClasses,
    roundedClasses,
    marginClasses,
    borderClasses,
    backgroundClasses
  )

  let selectedItem = placeHolder ? placeHolder : null
  if (currentValue) {
    selectedItem = formatValue ? formatValue(currentValue) : currentValue
  }

  return (
    <>
      <Menu>
        {({ isExpanded }) => (
          <>
            <MenuButton className={classnames(className, 'focus:outline-none')}>
              <div className='flex flex-col text-left'>
                <label htmlFor={id} className={labelClassName}>
                  {label}
                </label>
                <div className='w-full flex justify-between'>
                  <div className='flex'>{selectedItem}</div>
                  <FeatherIcon
                    icon={isExpanded ? 'chevron-up' : 'chevron-down'}
                    className='relative w-4 h-4 sm:w-8 sm:h-8 inline-block my-auto'
                    strokeWidth='0.15rem'
                  />
                </div>
              </div>
            </MenuButton>

            <MenuPopover position={positionMatchWidth}>
              <MenuItems>{menuItems}</MenuItems>
            </MenuPopover>
          </>
        )}
      </Menu>
    </>
  )
}
