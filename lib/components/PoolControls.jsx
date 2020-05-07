import React from 'react'
import classnames from 'classnames'

import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

export const PoolControls = (props) => {
  const {
    chainValues
  } = props

  console.log({ sec: chainValues.remainingSecondsToPrize})

  return <>
    <div
      className={classnames(
        'flex flex-col sm:flex-row justify-between items-center',
        'py-8 px-4 sm:p-8 sm:py-4 rounded-xl text-base sm:text-lg mb-0',
        '-mx-8 sm:-mx-8 lg:-mx-12',
      )}
    >
      <div
        className='w-1/4 rounded-lg px-4 py-1 bg-purple-1100 opacity-80 hover:opacity-100 trans'
      >
        <strong
          className='text-purple-400'
        >
          Pool Total Supply:
        </strong>
        <br />
        {/* {displayAmountInEther(ethBalance, { precision: 2 })} */}
      </div>
      <div
        className='w-1/4 rounded-lg px-4 py-1 bg-purple-1100 opacity-80 hover:opacity-100 trans'
      >
        <strong
          className='text-purple-400'
        >
          Seconds until reward:
        </strong>
        <br />
        {chainValues.remainingSecondsToPrize.toString()}
      </div>
    </div>
    
  </>
}

