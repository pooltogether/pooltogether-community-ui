import React from 'react'
import classnames from 'classnames'

export const FormLockedOverlay = ({
  children,
  title,
  flexColJustifyClass='justify-center',
  topMarginClass='sm:-mt-4',
  zLayerClass = 'z-20'
}) => {
  if (flexColJustifyClass === 'justify-start') {
    topMarginClass = 'sm:mt-4'
  }

  return <>
    <div
      className={classnames(
        `${flexColJustifyClass} ${zLayerClass}`,
        `flex flex-col items-center absolute text-center p-4 lg:p-10 rounded-lg`
      )}
      style={{
        backgroundColor: 'rgba(39, 18, 75, 0.97)',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      }}
    >
      <div
        className={`${topMarginClass} rounded-lg text-center mx-auto px-3 sm:px-6 py-4 sm:py-6 text-base sm:text-lg text-purple-200 w-10/12 sm:w-3/4`}
        style={{
          backgroundColor: 'rgba(70, 30, 125, 1)'
        }}
      >
        <div
          className='text-sm sm:text-base lg:text-lg uppercase text-lightPurple-600 font-bold mb-2'
        >
          {title}
        </div>

        {children}
      </div>
    </div>
  </>
}