import React from 'react'
import { LoadingLogo } from './LoadingLogo'

export const LoadingScreen = (props) => {
  const { isInitialized } = props

  if (!isInitialized) {
    return (
      <div className='w-screen h-screen flex flex-col justify-center'>
        <LoadingLogo className='mx-auto' />
      </div>
    )
  }

  return props.children
}
