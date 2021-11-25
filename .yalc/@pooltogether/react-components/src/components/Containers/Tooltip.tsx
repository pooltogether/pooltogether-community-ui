import React, { useRef } from 'react'
import ReactTooltip from 'react-tooltip'
import FeatherIcon from 'feather-icons-react'
import classnames from 'classnames'

// @ts-ignore
export const overrideToolTipPosition = ({ left, top }, currentEvent, currentTarget, node) => {
  const d = document.documentElement
  left = Math.min(d.clientWidth - node.clientWidth, left)
  top = Math.min(d.clientHeight - node.clientHeight, top)
  left = Math.max(0, left)
  top = Math.max(0, top)
  return { top, left }
}

export const Tooltip = (props) => {
  const {
    children,
    tip,
    className,
    iconClassName,
    iconSizeClassName,
    id,
    place,
    effect,
    toolTipClassName,
    isEnabled
  } = props
  const ref = useRef(null)

  if (!isEnabled) {
    return children
  }

  if (!id) {
    console.warn('Component requires an id! <Tooltip /> with children: ', children)
  }

  return (
    <>
      <span
        data-tip
        data-for={`${id}-tooltip`}
        className={classnames('inline cursor-pointer', className)}
      >
        {children || (
          <FeatherIcon icon='info' className={classnames(iconSizeClassName, iconClassName)} />
        )}
      </span>
      <ReactTooltip
        clickable
        ref={ref}
        backgroundColor='#111'
        id={`${id}-tooltip`}
        place={place}
        effect={effect}
        data-multiline
        className={classnames(
          'p-1 xs:p-2 max-w-3/4 sm:max-w-sm text-center leading-relaxed font-normal',
          toolTipClassName
        )}
        overridePosition={overrideToolTipPosition}
      >
        <>
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
        </>
      </ReactTooltip>
    </>
  )
}

Tooltip.defaultProps = {
  effect: 'solid',
  iconSizeClassName: 'w-4 h-4',
  isEnabled: true,
  place: 'top'
}
