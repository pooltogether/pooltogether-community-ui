import React, { useContext } from 'react'
import ContentLoader from 'react-content-loader'
import { isMobile } from 'react-device-detect'

import { ThemeContext } from '../ThemeContextProvider'

export const PrizeShowUILoader = (props) => {
  if (typeof window === 'undefined') {
    return null
  }

  const { theme } = useContext(ThemeContext)

  const bgColor = theme === 'light' ? '#ffffff' : '#401C94'
  const foreColor = theme === 'light' ? '#f5f5f5' : '#501C94'

  if (isMobile) {
    return (
      <ContentLoader viewBox='0 0 600 1200' backgroundColor={bgColor} foregroundColor={foreColor}>
        <rect x='0' y='0' rx='5' ry='5' width='600' height='110' />{' '}
        <rect x='0' y='130' rx='5' ry='5' width='600' height='140' />
        <rect x='0' y='290' rx='5' ry='5' width='600' height='710' />
      </ContentLoader>
    )
  }

  return (
    <>
      <ContentLoader viewBox='0 0 600 600' backgroundColor={bgColor} foregroundColor={foreColor}>
        <rect x='0' y='0' rx='5' ry='5' width='300' height='50' />{' '}
        <rect x='0' y='58' rx='5' ry='5' width='600' height='60' />
        <rect x='0' y='125' rx='5' ry='5' width='600' height='470' />
      </ContentLoader>
    </>
  )
}
