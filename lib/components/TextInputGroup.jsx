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
    rightLabel,
    value
  } = props

  return <>
    <div
      className='input-fieldset py-2 mb-0'
    >

      <div
        className={classnames(
          'flex',
          {
            'justify-between': rightLabel,
            'justify-center': !rightLabel,
          }
        )
      }>
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

        {rightLabel && <>
          <label
            className={classnames(
              'mt-0 pb-1 sm:pr-8 sm:pl-2 trans text-right w-1/2',
              {
                'font-bold text-primary cursor-not-allowed': disabled,
                'font-bold text-default-soft hover:text-default': !disabled,
              }
            )}
          >
            {rightLabel}
          </label>
        </>}
    </div>


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
