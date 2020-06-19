import React from 'react'

import { FormPanel } from 'lib/components/FormPanel'
import { DepositUI } from 'lib/components/DepositUI'
import { SweepTimelockedUI } from 'lib/components/SweepTimelockedUI'
import { UnlockDepositUI } from 'lib/components/UnlockDepositUI'
import { WithdrawUI } from 'lib/components/WithdrawUI'

export const UserActionsUI = (props) => {
  return <>
    <div
      className='flex flex-col sm:flex-row'
    >
      <FormPanel>
        {props.usersChainValues.usersTokenAllowance.gt(0) ?
          <DepositUI
            {...props}
          /> :
          <UnlockDepositUI
            {...props}
          />
        }
      </FormPanel>
      
      <FormPanel>
        <WithdrawUI
          {...props}
        />
      </FormPanel>
    </div>  

    <FormPanel>
      <SweepTimelockedUI
        {...props}
      />
    </FormPanel>
  </>
}

