import React from 'react'
import classnames from 'classnames'

import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

export const MainPanel = (props) => {
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
        'bg-purple-1200 py-8 px-4 sm:p-8 sm:py-4 rounded-xl text-base sm:text-lg mb-12',
        '-mx-8 sm:-mx-8 lg:-mx-12',
      )}
    >
      <div className='rounded-lg px-4 py-1 bg-purple-1100 opacity-80 hover:opacity-100 trans'>
        <strong>ETH Balance:</strong>
        <br />
        {displayAmountInEther(ethBalance, { precision: 2 })}
      </div>

      <div className='rounded-lg px-4 py-1 bg-purple-1100 opacity-80 hover:opacity-100 trans'>
        <strong>ERC20 Token Balance: (DAI or USDC)</strong>
        <br />
        {displayAmountInEther(usersERC20Balance, { precision: 2 })} 
      </div>

      <div className='rounded-lg px-4 py-1 bg-purple-1100 opacity-80 hover:opacity-100 trans'>
        <span className='text-yellow-500'>
          <strong>Allowance: (DAI or USDC)</strong>
          <br />
          {displayAmountInEther(usersERC20Allowance, { precision: 2 })}
        </span>
      </div>

      <div className='rounded-lg px-4 py-1 bg-purple-1100 opacity-80 hover:opacity-100 trans'>
        <strong>Your Pool Balance:</strong>
        <br />
        {displayAmountInEther(usersTicketBalance, { precision: 2 })}
      </div>
      {/* <DepositPanel
      /> */}
    </div>
  </>
}

