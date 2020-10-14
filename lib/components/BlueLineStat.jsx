import React from 'react'

export const BlueLineStat = ({
  title,
  value,
}) => {
  return <>
    <div
      className='flex items-center justify-center font-headline text-white text-xs sm:text-sm lg:text-lg'
    >
      {title}
      {/* <span
        className='inline-block w-5 bg-blue mr-2'
        style={{
          height: 2
        }}
      ></span> {title} <span
        className='inline-block w-5 bg-blue ml-2'
        style={{
          height: 2
        }}
      ></span> */}
    </div>

    <div
      className='flex justify-center font-bold text-green text-lg sm:text-xl lg:text-2xl mt-1 mb-1 glow'
    >
      {value}
    </div>
  </>
}