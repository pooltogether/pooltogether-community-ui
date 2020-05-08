import React from 'react'
import classnames from 'classnames'

import { UnlockDepositUI } from 'lib/components/UnlockDepositUI'
import { DepositUI } from 'lib/components/DepositUI'
import { WithdrawUI } from 'lib/components/WithdrawUI'

export const UserActionsUI = (props) => {
  return <>
    <div
      className='flex flex-col sm:flex-row'
    >
      <div
        className={classnames(
          'bg-purple-1000 px-2 pt-4 pb-16 rounded-xl w-full sm:w-1/2',
          'lg:w-3/4 text-base sm:text-lg mb-20',
          '',
        )}
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
          'bg-purple-1000 px-2 pt-4 pb-16 rounded-xl w-full sm:w-1/2',
          'lg:w-3/4 text-base sm:text-lg mb-20',
          '',
        )}
      >
        <WithdrawUI
          {...props}
        />
      </div>
    </div>    
  </>
}

