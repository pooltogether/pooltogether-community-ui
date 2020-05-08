import React from 'react'

export const StatContainer = ({
  children
}) => {
  return <>
    <div
      // bg-purple-1100
      className='w-full sm:w-1/3 flex-grow rounded-lg my-1 px-4 trans'
    >
      {children}
    </div>
  </>
}