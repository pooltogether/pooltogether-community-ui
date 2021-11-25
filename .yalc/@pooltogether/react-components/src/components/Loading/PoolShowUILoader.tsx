import React, { useContext } from 'react'
import ContentLoader from 'react-content-loader'
import { isMobile } from 'react-device-detect'

import { ThemeContext } from '../ThemeContextProvider'

export const PoolShowUILoader = (props) => {
  if (typeof window === 'undefined') {
    return null
  }

  const { theme } = useContext(ThemeContext)

  const bgColor = theme === 'light' ? '#ffffff' : '#401C94'
  const foreColor = theme === 'light' ? '#f5f5f5' : '#501C94'

  if (isMobile) {
    return (
      <ContentLoader viewBox='0 0 600 1200' backgroundColor={bgColor} foregroundColor={foreColor}>
        <rect x='0' y='0' rx='5' ry='5' width='350' height='100' />{' '}
        <rect x='0' y='120' rx='5' ry='5' width='600' height='90' />{' '}
        <rect x='0' y='230' rx='5' ry='5' width='600' height='500' />
        <rect x='0' y='760' rx='5' ry='5' width='600' height='510' />
      </ContentLoader>
    )
  }

  return (
    <>
      <ContentLoader viewBox='0 0 600 600' backgroundColor={bgColor} foregroundColor={foreColor}>
        <rect x='0' y='0' rx='5' ry='5' width='200' height='50' />{' '}
        <rect x='440' y='0' rx='5' ry='5' width='160' height='50' />
        <rect x='0' y='60' rx='5' ry='5' width='600' height='110' />
        <rect x='0' y='180' rx='5' ry='5' width='600' height='300' />
      </ContentLoader>
    </>
  )
}
