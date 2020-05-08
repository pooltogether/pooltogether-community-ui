import React from 'react'
import classnames from 'classnames'

import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

export const PoolControls = (props) => {
  const {
    genericChainValues
  } = props

  return <>
    <div
      className={classnames(
        'flex flex-col sm:flex-row justify-between items-center',
        'py-8 px-4 sm:p-8 sm:py-4 rounded-xl text-base sm:text-lg',
        'sm:-mx-8 lg:-mx-12 my-4',
      )}
    >
      <div
        className='w-full sm:w-1/3  mx-2  rounded-lg px-4 py-1 bg-purple-1100 opacity-80 hover:opacity-100 trans'
      >
        <strong
          className='text-purple-400'
        >
          Total ticket supply:
        </strong>
        <br />
        {displayAmountInEther(genericChainValues.ticketTotalSupply, { precision: 2 })}
      </div>

      <div
        className='w-full sm:w-1/3  mx-2  rounded-lg px-4 py-1 bg-purple-1100 opacity-80 hover:opacity-100 trans'
      >
        <strong
          className='text-purple-400'
        >
          Estimated prize remaining:
        </strong>
        <br />
        {displayAmountInEther(genericChainValues.estimateRemainingPrize, { precision: 0 })}
      </div>



      <div
        className='w-full sm:w-1/3  mx-2  rounded-lg px-4 py-1 bg-purple-1100 opacity-80 hover:opacity-100 trans'
      >
        <strong
          className='text-purple-400'
        >
          Seconds until reward:
        </strong>
        <br />
        {genericChainValues.remainingSecondsToPrize.toString()}
      </div>
    </div>
    
  </>
}

