import { DepositUI } from 'lib/components/DepositUI'
import { FormPanel } from 'lib/components/FormPanel'
import { PermitAndDepositUI } from 'lib/components/PermitAndDepositUI'
import { SweepTimelockedUI } from 'lib/components/SweepTimelockedUI'
import { UnlockDepositUI } from 'lib/components/UnlockDepositUI'
import { WithdrawUI } from 'lib/components/WithdrawUI'
import { DAI_MAINNET_ADDRESS } from 'lib/constants'
import React from 'react'

export const UserActionsUI = (props) => {
  let depositUI
  if (props?.poolAddresses?.token?.toLowerCase() === DAI_MAINNET_ADDRESS) {
    depositUI = <PermitAndDepositUI {...props} />
  } else {
    depositUI = props.usersChainValues.usersTokenAllowance.gt(0) ? (
      <DepositUI {...props} />
    ) : (
      <UnlockDepositUI {...props} />
    )
  }
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
