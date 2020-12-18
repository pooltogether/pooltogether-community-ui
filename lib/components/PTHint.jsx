import React, { useState } from 'react'

import { TooltipPopup, useTooltip } from '@reach/tooltip'
import classnames from 'classnames'
import { QuestionMarkCircle } from 'lib/components/QuestionMarkCircle'

// Center the tooltip, but collisions will win
const custom = (triggerRect, tooltipRect) => {
  const triggerCenter = triggerRect.left + triggerRect.width / 2
  const left = triggerCenter - tooltipRect.width / 2
  const maxLeft = window.innerWidth - tooltipRect.width - 2

  return {
    left: Math.min(Math.max(2, left), maxLeft) + window.scrollX,
    top: 60 + window.scrollY
  }
}

export const PTHint = (props) => {
  const { children, className, title } = props
  let { tip } = props

  const [trigger, tooltip] = useTooltip()

  const [isVisible, setIsVisible] = useState(false)

  const show = (e) => {
    setIsVisible(true)
  }

  const hide = (e) => {
    setIsVisible(false)
  }

  const toggleVisible = (e) => {
    setIsVisible(!isVisible)
  }

  if (title) {
    tip = (
      <>
        <div className='-mx-8 bg-black px-8 py-4 -mt-6 rounded-t-lg'>
          <h5 className='text-green-1'>{title}</h5>
        </div>

        <div className='pt-4'>{tip}</div>
      </>
    )
  }

  return (
    <>
      <div className={classnames(className, 'inline-block relative cursor-pointer')}>
        <div
          {...trigger}
          onMouseEnter={show}
          onMouseOut={hide}
          onTouchStart={toggleVisible}
          className={classnames('cursor-pointer h-full l-0 r-0 t-0 b-0 absolute')}
          style={{
            zIndex: 12314082
          }}
        />

        {children ? children : <QuestionMarkCircle />}
      </div>

      <TooltipPopup {...tooltip} isVisible={isVisible} label={tip} position={custom} />
    </>
  )
}
