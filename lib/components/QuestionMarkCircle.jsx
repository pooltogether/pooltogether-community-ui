import React from 'react'
import classnames from 'classnames'

export const QuestionMarkCircle = (props) => {
  const { white } = props

  let defaultClasses = 'bg-blue-700 text-white'
  if (white) {
    defaultClasses = 'bg-transparent text-white border-white border-2'
  }

  return <>
    <span
      className={classnames(
        defaultClasses,
        'flex items-center justify-center rounded-full w-6 h-6 sm:w-5 sm:h-5 mx-1',
      )}
    >
      <span
        className='relative font-number font-bold text-base'
        style={{
          left: '0.05rem'
        }}
      >
        ?
      </span>
    </span>
  </>
}
