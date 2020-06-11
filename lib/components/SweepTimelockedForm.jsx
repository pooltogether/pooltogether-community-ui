import React from 'react'

import { Button } from 'lib/components/Button'
import { FormLockedOverlay } from 'lib/components/FormLockedOverlay'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

export const SweepTimelockedForm = (props) => {
  const {
    disabled,
    genericChainValues,
    handleSubmit,
    usersTimelockBalance,
  } = props

  const {
    erc20Decimals
  } = genericChainValues
  
  const tokenSymbol = genericChainValues.erc20Symbol || 'TOKEN'

  return <>
    <form
      onSubmit={handleSubmit}
    >
      {disabled && <FormLockedOverlay
        topMarginClass='mt-0'
        title='Sweep Timelocked Funds'
      >
        <>
          You have no scheduled funds to sweep.
        </>
      </FormLockedOverlay>}
      
      <div
        className='font-bold mb-2 py-2 text-lg sm:text-xl lg:text-2xl'
      >
        Sweep Timelocked Funds:
      </div>

      {!disabled && <>
        <div className='text-yellow-400'>
          You have {displayAmountInEther(usersTimelockBalance, { decimals: erc20Decimals })} {tokenSymbol} scheduled for withdrawal after the interest has matured.
          {/* TODO: Unable to get timelockBalanceAvailableAt working */}
        </div>
      </>}
      
      <div
        className='my-5'
      >
        <Button
          color='green'
        >
          Sweep
        </Button>
      </div>
    </form>
  </>
}
