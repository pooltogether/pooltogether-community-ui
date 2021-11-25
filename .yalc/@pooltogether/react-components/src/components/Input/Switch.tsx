import classNames from 'classnames'
import React from 'react'

interface SwitchProps {
  enabled: boolean
  setEnabled: (checked: boolean) => void
  className?: string
  borderClassName?: string
  toggleBgClassName?: string
}

export const Switch = (props: SwitchProps) => {
  const { enabled, setEnabled, toggleBgClassName, borderClassName } = props
  return (
    <label
      className={classNames('flex p-1 w-12 rounded-full transition-all', borderClassName)}
      style={{ width: '2.7rem' }}
    >
      <input
        type='checkbox'
        className='opacity-0 h-0 w-0'
        checked={enabled}
        onChange={() => setEnabled(!enabled)}
      />
      <span
        className={classNames(`w-4 h-4 rounded-full transition-all transform`, toggleBgClassName, {
          'translate-x-4': enabled,
          'translate-x-0 opacity-50': !enabled
        })}
      ></span>
    </label>
  )
}

Switch.defaultProps = {
  toggleBgClassName: 'bg-inverse-purple',
  borderClassName: 'border'
}
