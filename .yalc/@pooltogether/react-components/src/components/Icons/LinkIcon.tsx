import React from 'react'
import classnames from 'classnames'
import FeatherIcon from 'feather-icons-react'

export const LinkIcon = (props) => {
  const { className, ...remainingProps } = props
  return (
    <FeatherIcon
      {...remainingProps}
      icon='arrow-up-right'
      className={classnames('inline-block', className)}
    />
  )
}
