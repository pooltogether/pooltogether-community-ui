import React from 'react'
import {
  getLegacyButtonClassNames,
  LegacyButtonClassNameProps
} from '../../utils/getLegacyButtonClassNames'

interface ButtonLinkProps extends LegacyButtonClassNameProps {
  children: React.ReactNode
  ref?: React.Ref<HTMLAnchorElement>
  href?: string
  rel?: string
  type?: string
  target?: string
}

export const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (props: ButtonLinkProps, ref) => {
    const { rel, href, target, children } = props
    const classes = getLegacyButtonClassNames(props)
    console.log({ rel, href, target, children, ref })
    return (
      <a
        ref={ref}
        children={children}
        rel={rel}
        href={href}
        className={classes}
        target={target}
        // onClick={(e) => e.stopPropagation()}
      />
    )
  }
)
