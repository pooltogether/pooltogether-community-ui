import React from 'react'

export const StatContainer = ({
  children
}) => {
  return <>
    <div
      className='w-full flex-grow rounded-lg mt-1 mb-3 trans p-4 bg-card'
    >
      {children}
    </div>
  </>
}