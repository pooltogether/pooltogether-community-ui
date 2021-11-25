import React from 'react'
import classnames from 'classnames'

export function ThemedClipSpinner(props) {
  const { sizeClassName, size, className } = props

  return (
    <div
      className={classnames('lds-dual-ring', className, size ? '' : sizeClassName)}
      style={
        size
          ? {
              width: size,
              height: size
            }
          : undefined
      }
    />
  )
}

ThemedClipSpinner.defaultProps = {
  sizeClassName: 'w-5 h-5'
}
