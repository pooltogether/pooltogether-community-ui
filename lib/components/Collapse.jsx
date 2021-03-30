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
        {title && <CardTitle>{title}</CardTitle>}
        {renderCustomIcon ? (
          renderCustomIcon({ showContent, setShowContent })
        ) : (
          <FeatherIcon
            icon='chevron-down'
            strokeWidth='0.25rem'
            className={classnames(
              'ml-3 sm:ml-4 my-auto w-3 h-3 sm:w-4 sm:h-4 my-auto stroke-current text-accent-1 cursor-pointer',
              {
                'rotate-180': showContent
              }
            )}
            onClick={() => setShowContent(!showContent)}
          />
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
