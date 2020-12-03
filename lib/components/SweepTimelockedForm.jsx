import React from 'react'

import { Button } from 'lib/components/Button'
import { FormLockedOverlay } from 'lib/components/FormLockedOverlay'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

export const SweepTimelockedForm = (props) => {
  const {
    hasFundsToSweep,
    poolChainValues,
    handleSubmit,
    usersTimelockBalance,
    usersTimelockBalanceAvailableAt
  } = props

  const { tokenDecimals } = poolChainValues

  const now = parseInt(Date.now() / 1000, 10)
  const fundsReadyInSeconds = usersTimelockBalanceAvailableAt - now
  const buttonDisabled = fundsReadyInSeconds > 0

  const tokenSymbol = poolChainValues.tokenSymbol || 'TOKEN'

  return (
    <>
      <form onSubmit={handleSubmit}>
        {hasFundsToSweep && (
          <FormLockedOverlay topMarginClass='mt-0' title='Sweep Timelocked Funds'>
            <>You have no scheduled funds to sweep.</>
          </FormLockedOverlay>
        )}

        <div className='font-bold mb-2 py-2 text-lg sm:text-xl lg:text-2xl'>
          Sweep Timelocked Funds:
        </div>

        {!hasFundsToSweep && (
          <>
            <div className='text-green'>
              You have {displayAmountInEther(usersTimelockBalance, { decimals: tokenDecimals })}{' '}
              {tokenSymbol} scheduled for withdrawal after the interest has matured.
            </div>
          </>
        )}

        {fundsReadyInSeconds > 0 && (
          <>
            <div className='text-orange'>
              Your funds will be available in{' '}
              {numberWithCommas(fundsReadyInSeconds, { precision: 0 })} seconds.
            </div>
          </>
        )}

        <div className='my-5'>
          <Button color='green' disabled={buttonDisabled}>
            Sweep
          </Button>
        </div>
      </form>
    </>
  )
}
