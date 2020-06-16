import React from 'react'
import classnames from 'classnames'

import { UnlockDepositUI } from 'lib/components/UnlockDepositUI'
import { DepositUI } from 'lib/components/DepositUI'
import { SweepTimelockedUI } from 'lib/components/SweepTimelockedUI'
import { WithdrawUI } from 'lib/components/WithdrawUI'

export const UserActionsUI = (props) => {
  return <>
    <div
      className='flex flex-col sm:flex-row'
    >
      <div
        className={classnames(
          'relative sm:-l-2 px-6 py-5 rounded-xl w-full sm:w-1/2',
          'text-left text-base sm:text-lg mb-4 bg-purple-1100',
        )}
        // style={{
        //   backgroundColor: 'rgba(64, 28, 109, 0.7)'
        // }}
      >
        {props.usersChainValues.usersERC20Allowance.gt(0) ?
          <DepositUI
            {...props}
          /> :
          <UnlockDepositUI
            {...props}
          />
        }
      </div>
      <div
        className={classnames(
          'relative sm:-r-2 px-6 py-5 rounded-xl w-full sm:w-1/2',
          'text-left text-base sm:text-lg mb-4 bg-purple-1100',
        )}
        // style={{
        //   backgroundColor: 'rgba(64, 28, 109, 0.7)'
        // }}
      >
        <WithdrawUI
          {...props}
        />
      </div>
    </div>  

    <div
      className={classnames(
        'relative sm:-l-2 px-6 py-5 rounded-xl w-full sm:w-1/2',
        'text-left text-base sm:text-lg mb-4',
      )}
      style={{
        backgroundColor: 'rgba(64, 28, 109, 0.7)'
      }}
    >
      <SweepTimelockedUI
        {...props}
      />
    </div>  
  </>
}

