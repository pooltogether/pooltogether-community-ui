import React from 'react'

import { DepositUI } from 'lib/components/DepositUI'
import { FormPanel } from 'lib/components/FormPanel'
import { SweepTimelockedUI } from 'lib/components/SweepTimelockedUI'
import { UnlockDepositUI } from 'lib/components/UnlockDepositUI'
import { WithdrawUI } from 'lib/components/WithdrawUI'
import { DAI_MAINNET_ADDRESS } from 'lib/constants'

export const UserActionsUI = (props) => {
  const depositUI = props.usersChainValues.usersTokenAllowance.gt(0) ? (
    <DepositUI {...props} />
  ) : (
    <UnlockDepositUI {...props} />
  )

  return (
    <>
      <div className='flex flex-col sm:flex-row'>
        <FormPanel>{depositUI}</FormPanel>

        <FormPanel>
          <WithdrawUI {...props} />
        </FormPanel>
      </div>

      <FormPanel>
        <SweepTimelockedUI {...props} />
      </FormPanel>
    </>
  )
}
