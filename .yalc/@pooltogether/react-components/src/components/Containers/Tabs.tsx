import React from 'react'
import classnames from 'classnames'

export const Tabs = ({ children, className }) => {
  return <nav className={classnames('flex', className)}>{children}</nav>
}

export const Tab = (props) => {
  const {
    isSelected,
    onClick,
    children,
    className,
    textClassName,
    paddingClassName,
    tabDeselectedClassName,
    tabSelectedClassName
  } = props

  return (
    <a
      onClick={onClick}
      className={classnames(
        className,
        paddingClassName,
        textClassName,
        'cursor-pointer capitalize leading-none trans tracking-wider outline-none focus:outline-none active:outline-none font-bold',
        {
          [tabDeselectedClassName]: !isSelected,
          [tabSelectedClassName]: isSelected
        }
      )}
      style={{ height: 'max-content' }}
    >
      {children}
    </a>
  )
}

Tab.defaultProps = {
  className: '',
  paddingClassName: 'px-2 py-1',
  textClassName: 'text-sm xs:text-lg lg:text-xl',
  tabDeselectedClassName:
    'text-accent-1 hover:text-inverse border-default border-b-0 hover:border-b-2',
  tabSelectedClassName: 'text-inverse border-b-2 border-default'
}

export const Content = ({ children, className }) => {
  return <div className={className}>{children}</div>
}

export const ContentPane = ({ children, className, isSelected, alwaysPresent }) => {
  let hiddenClassName = 'hidden'

  if (alwaysPresent) {
    hiddenClassName = 'pointer-events-none opacity-0 w-0 flex-shrink'
  }

  return (
    <div
      className={classnames({
        [hiddenClassName]: !isSelected,
        [className]: isSelected
      })}
    >
      {children}
    </div>
  )
}
