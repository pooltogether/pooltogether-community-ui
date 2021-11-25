import React, { useState } from 'react'
import FeatherIcon from 'feather-icons-react'
import classnames from 'classnames'

export const Collapse = (props) => {
  const { title, children, className } = props

  const [showContent, setShowContent] = useState(false)

  return (
    <>
      <div
        className={classnames('flex cursor-pointer', className, {
          'mb-4 sm:mb-8': showContent,
        })}
        onClick={() => setShowContent(!showContent)}
      >
        {title && <div className='font-bold text-base sm:text-2xl text-accent-1'>{title}</div>}
        <FeatherIcon
          icon='chevron-down'
          strokeWidth='0.25rem'
          className={classnames(
            'ml-3 sm:ml-4 my-auto w-3 h-3 sm:w-4 sm:h-4 my-auto stroke-current text-accent-1',
            {
              'rotate-180': showContent,
            }
          )}
        />
      </div>
      {showContent && children}
    </>
  )
}
