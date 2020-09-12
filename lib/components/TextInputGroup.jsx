import React from 'react'
import classnames from 'classnames'

import { Input } from 'lib/components/Input'

export const TextInputGroup = (
  props,
) => {
  const {
    id,
    label,
    required,
    disabled,
    type,
    pattern,
    onChange,
    value
  } = props

  return <>
    <div
      className='input-fieldset py-2 mb-0'
    >
      <label
        htmlFor={id}
        className={classnames(
          'mt-0 trans',
          {
            'text-purple cursor-not-allowed': disabled,
            'text-white hover:text-white': !disabled,
          }
        )}
      >
        {label}
      </label>
      <Input
        id={id}
        required={required}
        disabled={disabled}
        type={type || 'text'}
        pattern={pattern}
        onChange={onChange}
        value={value}
      />
    </div>
  </>
}
