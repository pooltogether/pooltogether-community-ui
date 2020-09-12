import React from 'react'
import classnames from 'classnames'

export function FormPanel(props) {
  const { className, children } = props
  return <>

    <div
      className={classnames(
        className,
        'relative pt-panel rounded-xl bg-default trans trans-fast',
        '-mx-8 sm:-mx-0 sm:mx-2 mb-4 px-12 py-4 sm:p-6 lg:p-10 w-full sm:w-3/4 lg:w-3/4',
        'text-left text-base sm:text-lg'
      )}
    >
      {children}
    </div>
  </>
}