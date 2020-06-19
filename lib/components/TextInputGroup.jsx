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
      className='input-fieldset py-2 mb-6'
    >
      <label
        htmlFor={id}
        className={classnames(
          'trans',
          {
            'text-purple-700 cursor-not-allowed': disabled,
            'text-purple-300 hover:text-white': !disabled,
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
