import React from 'react'
import ReactTooltip from 'react-tooltip'
import FeatherIcon from 'feather-icons-react'
import classnames from 'classnames'

export const Tooltip = (props) => {
  const { children, tip, className, id } = props
  return (
    <>
      <a
        data-tip
        data-for={`${id}-tooltip`}
        className={classnames('inline cursor-pointer', className)}
      >
        {children || <FeatherIcon icon='info' className='w-4 h-4' />}
      </a>
      <ReactTooltip
        clickable
        backgroundColor='#111'
        id={`${id}-tooltip`}
        place='top'
        effect='solid'
        data-multiline
        className='p-1 xs:p-2 max-w-3/4 sm:max-w-sm'
        overridePosition={({ left, top }, currentEvent, currentTarget, node) => {
          const d = document.documentElement
          left = Math.min(d.clientWidth - node.clientWidth, left)
          top = Math.min(d.clientHeight - node.clientHeight, top)
          left = Math.max(0, left)
          top = Math.max(0, top)
          return { top, left }
        }}
      >
        {tip}
      </ReactTooltip>
    </>
  )
}

Tooltip.defaultProps = {
  id: 'pt'
}
