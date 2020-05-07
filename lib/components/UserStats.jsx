import React from 'react'
import classnames from 'classnames'

import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

export const UserStats = (props) => {
  const {
    ethBalance,
    chainValues,
  } = props
  
  const {
    usersERC20Balance,
    usersERC20Allowance,
    usersTicketBalance,
  } = chainValues

  return <>
    <div
      className={classnames(
        'flex flex-col sm:flex-row justify-between',
        'py-8 px-4 sm:p-8 sm:py-4 rounded-xl text-base sm:text-lg mb-12',
        '-mx-8 sm:-mx-8 lg:-mx-12',
      )}
    >
      <div
        className='w-1/4 rounded-lg px-4 py-1 bg-purple-1100 opacity-80 hover:opacity-100 trans'
      >
        <strong
          className='text-purple-400'
        >ETH Balance:</strong>
        <br />
        {displayAmountInEther(ethBalance, { precision: 2 })}
      </div>

      <div
        className='w-1/4 rounded-lg px-4 py-1 bg-purple-1100 opacity-80 hover:opacity-100 trans'
      >
        <strong
          className='text-purple-400'
        >{chainValues.erc20Symbol || 'TOKEN'} Balance:</strong>
        <br />
        {displayAmountInEther(usersERC20Balance, { precision: 2 })} 
      </div>

      {usersERC20Allowance.lte(0) && <>
        <div
            className='w-1/4 rounded-lg px-4 py-1 bg-purple-1100 opacity-80 hover:opacity-100 trans'
          >
          <span className='text-yellow-400'>
            <strong
              className='text-purple-400'
            >{chainValues.erc20Symbol || 'TOKEN'} Allowance:</strong>
            <br />
            {displayAmountInEther(usersERC20Allowance, { precision: 2 })}
          </span>
        </div>
      </>}

      <div
        className='w-1/4 rounded-lg px-4 py-1 bg-purple-1100 opacity-80 hover:opacity-100 trans'
      >
        <strong
          className='text-purple-400'
        >Ticket Balance:</strong>
        <br />
        {displayAmountInEther(usersTicketBalance, { precision: 2 })}
      </div>
      {/* <DepositPanel
      /> */}
    </div>
  </>
}

