import React from 'react'
import classnames from 'classnames'

export const TicketRow = (props) => {
  const { left, right, cornerBgClassName, className } = props

  return (
    <div className={classnames('flex w-full', className)}>
      <div className={classnames('p-3 w-40 lg:w-48 rounded-l-lg bg-accent-grey-4 notched-box')}>
        <div className={classnames(`notched-corner notched-top-right`, cornerBgClassName)}></div>
        <div className={classnames(`notched-corner notched-bottom-right`, cornerBgClassName)}></div>
        {left}
      </div>
      <div
        className={classnames('my-3 bg-accent-grey-4 border-body border-dotted border-r-4')}
        style={{ width: 1 }}
      />
      <div className={classnames('rounded-r-lg bg-accent-grey-4 notched-box w-full')}>
        <div className={classnames(`notched-corner notched-top-left`, cornerBgClassName)}></div>
        <div className={classnames(`notched-corner notched-bottom-left`, cornerBgClassName)}></div>
        <div className='px-4 xs:px-8 py-3'>{right}</div>
      </div>
    </div>
  )
}

TicketRow.defaultProps = {
  cornerBgClassName: 'bg-body'
}
