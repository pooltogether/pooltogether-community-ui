import React from 'react'

export const Card = (props) => {
  const { children } = props

  return (
    <div className='bg-default py-3 px-3 sm:py-6 sm:px-12 rounded-xl w-full mb-4 sm:mb-10 fadeIn animated'>
      {children}
    </div>
  )
}
