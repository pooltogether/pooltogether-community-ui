import React from 'react'
import classnames from 'classnames'
import Link from 'next/link'

export const InternalLink = (props) => {
  const { children, ...linkProps } = props
  const disabled = linkProps.disabled

  return (
    <Link {...linkProps}>
      <a
        className={classnames(
          'flex underline font-bold text-highlight-3 border-purple-700 disabled:text-blue',
          {
            'hover:text-blue': disabled,
            'hover:text-cyan-400': !disabled
          }
        )}
      >
        {children}
      </a>
    </Link>
  )
}
