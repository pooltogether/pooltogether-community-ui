import React from 'react'
import classnames from 'classnames'

export const TipBanner = (props) => (
  <div
    className={classnames(
      'rounded-xl',
      props.paddingClassName,
      props.className,
      props.sizeClassName,
      props.backgroundClassName,
      props.borderClassName
    )}
  >
    <div className='flex flex-col sm:flex-row justify-between'>
      <div className='flex mb-4 sm:mb-0'>
        <span className='pool-gradient-1 rounded-full h-fit-content px-4 font-bold mr-4 my-auto text-white'>
          {props.t?.('tip') || 'Tip'}
        </span>
        <h5>{props.title}</h5>
      </div>
      <div className='flex mb-4 sm:mb-0'>{props.links}</div>
    </div>
    <div className='text-accent-1'>{props.children}</div>
  </div>
)

TipBanner.defaultProps = {
  paddingClassName: 'p-4 xs:py-6 xs:px-8 sm:py-6 sm:px-12',
  sizeClassName: 'w-full',
  backgroundClassName: 'bg-default',
  borderClassName: 'border border-default'
}
