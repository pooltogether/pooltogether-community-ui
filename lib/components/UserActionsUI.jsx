import React from 'react'

import { FormPanel } from 'lib/components/FormPanel'
import { DepositUI } from 'lib/components/DepositUI'
import { PermitAndDepositUI } from 'lib/components/PermitAndDepositUI'
import { SweepTimelockedUI } from 'lib/components/SweepTimelockedUI'
import { UnlockDepositUI } from 'lib/components/UnlockDepositUI'
import { WithdrawUI } from 'lib/components/WithdrawUI'

export const UserActionsUI = (props) => {
  let depositUI
  if (props.poolAddresses && props.poolAddresses.token.toLowerCase() === '0x6b175474e89094c44da98b954eedeac495271d0f') {
    depositUI = 
      <PermitAndDepositUI
          {...props}
        />
  } else {
    depositUI = props.usersChainValues.usersTokenAllowance.gt(0) ?
      <DepositUI
        {...props}
      /> :
      <UnlockDepositUI
        {...props}
      />
  }
  return <>
    <div
      className='flex flex-col sm:flex-row'
    >
      <FormPanel>
        {depositUI}
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

