import React, { useState } from 'react'
import FeatherIcon from 'feather-icons-react'
import classnames from 'classnames'
import { CardTitle } from 'lib/components/Card'

export const Collapse = (props) => {
  const {
    title,
    children,
    openOnMount,
    renderCustomIcon,
    headerClassName,
    headerMarginClassName,
    containerClassName
  } = props

  const [showContent, setShowContent] = useState(openOnMount)

  return (
    <>
      <div
        className={classnames('flex', headerClassName, headerMarginClassName, {
          'mb-4': showContent && !headerMarginClassName,
          'justify-between': title,
          'justify-end': title
        })}
      >
        {title && <CardTitle noMargin>{title}</CardTitle>}
        {renderCustomIcon ? (
          renderCustomIcon({ showContent, setShowContent })
        ) : (
          <Chevron rotate={showContent} onClick={() => setShowContent(!showContent)} />
        )}
      </div>
      <div
        className={classnames(containerClassName, {
          hidden: !showContent
        })}
      >
        {children}
      </div>
    </>
  )
}

Collapse.defaultProps = {
  openOnMount: false
}

export const Chevron = (props) => (
  <FeatherIcon
    icon='chevron-down'
    strokeWidth='0.25rem'
    className={classnames(
      'ml-3 sm:ml-4 w-3 h-3 sm:w-4 sm:h-4 my-auto stroke-current text-accent-1 cursor-pointer trans',
      {
        'rotate-180': props.rotate
      }
    )}
    onClick={props.onClick}
  />
)
