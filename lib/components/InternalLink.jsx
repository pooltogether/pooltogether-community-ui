import React from 'react'
import classnames from 'classnames'
import FeatherIcon from 'feather-icons-react'
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

// a {
//   @apply text-highlight-3;
//   /* @apply text-highlight-3 no-underline border-b-2 border-purple-1000; */
// }

// a:hover {
//   @apply text-cyan-400 border-purple-700;
// }

// a[disabled],
// a[disabled]:hover {
//   @apply text-blue;
// }
