import React from 'react'

/**
 * TODO: Add proposal count
 * @param {*} props
 * @returns
 */
export const BottomNavContainer = (props) => (
  <nav
    className='w-screen flex justify-center items-center b-0 l-0 r-0 bg-card-selected sm:hidden z-20 pb-6'
    style={{
      height: 96
    }}
  >
    {props.children}
  </nav>
)
