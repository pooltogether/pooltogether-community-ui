import React, { useContext } from 'react'
import classnames from 'classnames'

import { ThemeContext } from '../ThemeContextProvider'
import { LoadingDots } from './LoadingDots'

import LogoDark from '../../assets/PoolTogetherLogos/pooltogether-p.svg'
import Logo from '../../assets/PoolTogetherLogos/pooltogether-p-purple.svg'

export function LoadingLogo (props) {
  const { theme } = useContext(ThemeContext)

  return (
    <div className={classnames('flex flex-col', props.className)} style={{ width: 'min-content' }}>
      <img
        src={theme === 'dark' ? LogoDark : Logo}
        className='w-8 mx-auto'
        style={{ borderWidth: 0 }}
      />
      <LoadingDots />
    </div>
  )
}
