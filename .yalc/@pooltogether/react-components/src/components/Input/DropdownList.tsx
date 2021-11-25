import React from 'react'
import classnames from 'classnames'
import FeatherIcon from 'feather-icons-react'
import { Menu, MenuList, MenuButton, MenuItem } from '@reach/menu-button'

export function DropdownList(props) {
  const {
    id,
    className,
    current,
    formatValue,
    hoverTextColor,
    label,
    textColor,
    values,
    onValueSet,
    placeholder
  } = props

  const handleChangeValueClick = (newValue) => {
    onValueSet(newValue)
  }

  let valuesArray = []
  if (Array.isArray(values)) {
    valuesArray = values
  } else if (typeof values === 'object') {
    valuesArray = Object.keys(values).map((v) => v)
  }

  const menuItems = valuesArray.map((value) => {
    const selected = value === current

    if (value.groupHeader) {
      return (
        <div
          key={`${id}-value-picker-group-header-${value.groupHeader}`}
          className='opacity-50 text-accent-1 text-xs px-3 sm:px-5 pt-10'
        >
          {value.groupHeader}
        </div>
      )
    }

    return (
      <MenuItem
        key={`${id}-value-picker-item-${JSON.stringify(value)}`}
        onSelect={() => {
          handleChangeValueClick(value)
        }}
        className={classnames({
          selected
        })}
        disabled={value.disabled}
      >
        {formatValue ? formatValue(value) : value}
      </MenuItem>
    )
  })

  const inactiveTextColorClasses = `${textColor} hover:${hoverTextColor}`
  const activeTextColorClasses = `${hoverTextColor} hover:${hoverTextColor}`

  let buttonText = ''
  if (label) {
    buttonText = label
  } else if (current) {
    buttonText = formatValue(current)
  } else if (placeholder) {
    buttonText = placeholder
  }

  return (
    <>
      <Menu>
        {({ isExpanded }) => (
          <>
            <MenuButton
              className={classnames(
                className,
                'inline-flex items-center justify-center trans font-bold',
                {
                  [inactiveTextColorClasses]: !isExpanded,
                  [activeTextColorClasses]: isExpanded
                }
              )}
            >
              {buttonText}
              <FeatherIcon
                icon={isExpanded ? 'chevron-up' : 'chevron-down'}
                className='relative w-4 h-4 inline-block ml-2'
                strokeWidth='0.15rem'
              />
            </MenuButton>

            <MenuList className={`${id} slide-down overflow-y-auto max-h-1/2`}>
              {menuItems}
            </MenuList>
          </>
        )}
      </Menu>
    </>
  )
}
