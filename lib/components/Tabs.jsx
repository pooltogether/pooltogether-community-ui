import React, { useEffect } from 'react'
import classnames from 'classnames'
import { useRouter } from 'next/router'

export const Tabs = ({ children }) => {
  return <nav className='flex justify-start mb-2'>{children}</nav>
}

export const Tab = (props) => {
  const { selectedTab, setSelectedTab, hash, className, children } = props
  const isSelected = hash === selectedTab
  const router = useRouter()

  const changeHash = (hash) => {
    setSelectedTab(hash)

    router.push(`${router.route.split('#')[0]}${hash}`, `${router.asPath.split('#')[0]}${hash}`, {
      shallow: true
    })
  }

  const handleClick = (e) => {
    e.preventDefault()

    changeHash(hash)
  }

  return (
    <a
      onClick={handleClick}
      className={classnames(
        className,
        'cursor-pointer capitalize text-accent-1 hover:text-accent-3  tracking-wider outline-none focus:outline-none font-bold trans border-transparent text-lg sm:text-4xl border-b-4 hover:border-primary',
        {
          'border-green-1': isSelected
        }
      )}
    >
      {children}
    </a>
  )
}

export const Content = (props) => {
  const { children, className } = props
  return <div className={classnames(className, 'py-2 flex')}>{children}</div>
}

export const ContentPane = (props) => {
  const { children, alwaysPresent, hash, selectedTab } = props
  const isSelected = hash === selectedTab
  let hiddenClassName = 'hidden'
  let visibleClassName = 'flex-1'

  if (alwaysPresent) {
    hiddenClassName = 'pointer-events-none opacity-0 w-0 flex-shrink'
  }

  return (
    <div
      className={classnames({
        [hiddenClassName]: !isSelected,
        [visibleClassName]: isSelected
      })}
    >
      {children}
    </div>
  )
}
