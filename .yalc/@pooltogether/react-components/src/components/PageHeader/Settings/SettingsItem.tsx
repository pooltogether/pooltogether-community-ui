import React from 'react'
import classnames from 'classnames'
import { Tooltip } from '../../Containers/Tooltip'

export const SettingsItem = (props) => (
  <div className='mt-10'>
    <span
      className={classnames('flex text-accent-1 font-bold text-xxs', {
        'mb-2': !Boolean(props.description)
      })}
    >
      <span className='uppercase'>{props.label}</span>
      {props.tip && <Tooltip className='ml-1 my-auto' tip={props.tip} id={props.label} />}
    </span>
    {props.description && (
      <p className='text-inverse font-bold text-xxs mb-2'>{props.description}</p>
    )}
    {props.children}
  </div>
)
