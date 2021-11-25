import React, { useContext } from 'react'
import ContentLoader from 'react-content-loader'
import { isMobile } from 'react-device-detect'

import { ThemeContext } from '../ThemeContextProvider'

export const TicketsUILoader = (props) => {
  if (typeof window === 'undefined') {
    return null
  }

  const { theme } = useContext(ThemeContext)

  const bgColor = theme === 'light' ? '#ffffff' : '#401C94'
  const foreColor = theme === 'light' ? '#f5f5f5' : '#501C94'

  if (isMobile) {
    return (
      <ContentLoader viewBox='0 0 200 80' backgroundColor={bgColor} foregroundColor={foreColor}>
        <rect x='0' y='0' rx='3' ry='3' width='200' height='70' />
      </ContentLoader>
    )
  }

  return (
    <ContentLoader viewBox='0 0 400 50' backgroundColor={bgColor} foregroundColor={foreColor}>
      <rect x='0' y='0' rx='3' ry='3' width='400' height='40' />{' '}
    </ContentLoader>
  )
}
