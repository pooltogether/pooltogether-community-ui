import React from 'react'
import classnames from 'classnames'

/**
 * TODO: Add the proposal count
 * @param {*} props
 * @returns
 */
export const SideNavContainer = (props) => {
  const { className, style } = props

  return (
    <nav
      className={classnames(
        className,
        'flex-col items-start hidden sm:block pt-8 sm:pt-0 pl-2 sm:pr-12 lg:pr-16 text-center'
      )}
      style={style}
    >
      {props.children}
    </nav>
  )
}
