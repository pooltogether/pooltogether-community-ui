import { useScreenSize, ScreenSize } from '@pooltogether/hooks'
import React, { useContext } from 'react'

import { ThemeContext } from '../ThemeContextProvider'

import MobileLogo from '../../assets/PoolTogetherLogos/pooltogether-p-purple.svg'
import MobileLogoDark from '../../assets/PoolTogetherLogos/pooltogether-p.svg'
import DesktopLogo from '../../assets/PoolTogetherLogos/pooltogether-full-logo-purple.svg'
import DesktopLogoDark from '../../assets/PoolTogetherLogos/pooltogether-full-logo.svg'

export const HeaderLogo = () => {
  const screenSize = useScreenSize()
  const { theme } = useContext(ThemeContext)

  if (screenSize <= ScreenSize.sm) {
    return (
      <img
        src={theme === 'dark' ? MobileLogoDark : MobileLogo}
        style={{ height: '36px', width: '21px' }}
      />
    )
  }

  return (
    <img
      src={theme === 'dark' ? DesktopLogoDark : DesktopLogo}
      style={{ height: '60px', width: '151px' }}
    />
  )
}
