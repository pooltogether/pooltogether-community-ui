import React, { useRef, useState } from 'react'
import ReactTooltip from 'react-tooltip'
import FeatherIcon from 'feather-icons-react'
import classnames from 'classnames'

export const Tooltip = (props) => {
  const { children, tip, className, id, effect } = props
  const ref = useRef(null)

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
        ref={ref}
        backgroundColor='#111'
        id={`${id}-tooltip`}
        place='top'
        effect={effect}
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
        <button
          onClick={() => {
            const current = ref.current
            current.tooltipRef = null
            ReactTooltip.hide()
          }}
          className='ml-auto mb-2 block xs:hidden'
        >
          <FeatherIcon icon='x' className='w-4 h-4 text-inverse' />
        </button>
        {tip}
      </ReactTooltip>
    </>
  )
}

Tooltip.defaultProps = {
  id: 'pt',
  effect: 'solid'
}
