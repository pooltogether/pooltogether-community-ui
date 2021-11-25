import React, { useContext } from 'react'
import ContentLoader from 'react-content-loader'

import { ThemeContext } from '../ThemeContextProvider'

export const PoolsListUILoader = (props) => {
  if (typeof window === 'undefined') {
    return null
  }

  const { theme } = useContext(ThemeContext)

  const bgColor = theme === 'light' ? '#ffffff' : '#401C94'
  const foreColor = theme === 'light' ? '#f5f5f5' : '#501C94'

  return (
    <>
      <ContentLoader
        gradientRatio={2.5}
        interval={0.05}
        speed={0.6}
        viewBox='0 0 600 600'
        backgroundColor={bgColor}
        foregroundColor={foreColor}
      >
        <rect x='0' y='0' rx='5' ry='5' width='600' height='100' />
        <rect x='0' y='110' rx='5' ry='5' width='600' height='100' />
        <rect x='0' y='220' rx='5' ry='5' width='600' height='100' />
        <rect x='0' y='330' rx='5' ry='5' width='600' height='100' />
        <rect x='0' y='440' rx='5' ry='5' width='600' height='100' />
      </ContentLoader>
    </>
  )
}

export const PoolsListRowLoader = (props) => {
  if (typeof window === 'undefined') {
    return null
  }

  const { theme } = useContext(ThemeContext)

  const bgColor = theme === 'light' ? '#ffffff' : '#401C94'
  const foreColor = theme === 'light' ? '#f5f5f5' : '#501C94'

  return (
    <>
      <ContentLoader
        gradientRatio={2.5}
        interval={0.05}
        speed={0.6}
        viewBox='0 0 600 100'
        backgroundColor={bgColor}
        foregroundColor={foreColor}
      >
        <rect x='0' y='0' rx='5' ry='5' width='600' height='100' />
      </ContentLoader>
    </>
  )
}
