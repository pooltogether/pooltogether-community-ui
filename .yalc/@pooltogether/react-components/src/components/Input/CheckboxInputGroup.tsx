import React from 'react'
import classnames from 'classnames'

import { Tooltip } from '../Containers/Tooltip'

export const CheckboxInputGroup = (props) => {
  const { id, hint, label, handleClick, checked } = props

  let { marginClasses } = props

  const defaultClasses =
    'font-bold flex justify-start items-start xs:items-center trans trans-faster cursor-pointer font-bold outline-none focus:outline-none hover:outline-none active:outline-none leading-none px-0 py-1'
  const roundedClasses = 'rounded-sm'
  marginClasses = marginClasses ?? 'mt-1 mb-1 sm:mb-3 lg:mb-4'
  const textClasses = 'text-xxs'

  return (
    <div
      className={classnames(defaultClasses, textClasses, marginClasses, roundedClasses, {
        'text-white inner-lg': checked,
        'text-white': !checked
      })}
      onClick={handleClick}
    >
      <div
        id={id}
        onClick={handleClick}
        className={classnames('flex items-center justify-center my-auto mr-3 leading-none')}
      >
        <div
          className={classnames('flex items-center rounded-sm w-4 h-4 border-2 trans', {
            'text-white border-white hover:border-white': checked,
            'text-darkened border-white hover:border-green': !checked
          })}
        >
          <svg
            className={classnames('relative check', {
              checked: checked
            })}
            width='135'
            height='110'
            viewBox='0 0 135 110'
          >
            <path d='M96.8002 0L30.7002 66.1L0.200195 37.4' />
          </svg>
        </div>
      </div>

      <div className='text-left flex flex-col items-start justify-start leading-snug'>{label}</div>

      {hint && <Tooltip tip={hint} id={id} />}
    </div>
  )
}
