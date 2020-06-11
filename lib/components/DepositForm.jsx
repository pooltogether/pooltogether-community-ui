import React from 'react'
import classnames from 'classnames'
import { ethers } from 'ethers'

import { Button } from 'lib/components/Button'
import { FormLockedOverlay } from 'lib/components/FormLockedOverlay'
import { Input } from 'lib/components/Input'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

export const DepositForm = (props) => {
  const {
    genericChainValues,
    handleSubmit,
    vars,
    stateSetters,
    disabled,
    usersChainValues,
  } = props

  const {
    usersERC20Balance,
  } = usersChainValues || {}

  const {
    erc20Decimals,
  } = genericChainValues || {}

  const poolIsLocked = genericChainValues.isRngRequested
  const tokenSymbol = genericChainValues.erc20Symbol || 'TOKEN'

  let depositAmount, setDepositAmount
  if (vars && stateSetters) {
    depositAmount = vars.depositAmount
    setDepositAmount = stateSetters.setDepositAmount
  }

  const overBalance = depositAmount && usersERC20Balance && usersERC20Balance.lt(
    ethers.utils.parseUnits(depositAmount, erc20Decimals)
  )

  return <>
    <form
      onSubmit={handleSubmit}
    >
      {poolIsLocked && <FormLockedOverlay
        title='Deposit'
      >
        <div>
          The Pool is currently being awarded and until awarding is complete can not accept withdrawals.
        </div>
      </FormLockedOverlay>}

      {disabled && <FormLockedOverlay
        title='Deposit'
      >
        <>
          <div
          >
            Unlock deposits by first approving the pool's ticket contract to have a DAI allowance.
          </div>

          <div
            className='mt-3 sm:mt-5 mb-5'
          >
            <Button
              color='green'
            >
              Unlock Deposits
            </Button>
          </div>
        </>
      </FormLockedOverlay>}
      
      <div
        className='font-bold mb-2 py-2 text-lg sm:text-xl lg:text-2xl'
      >
        Deposit:
      </div>

      

      <label
        htmlFor='depositAmount'
        className={classnames(
          'trans',
          {
            'text-purple-700 cursor-not-allowed': disabled,
            'text-purple-300 hover:text-white': !disabled,
          }
        )}
      >
        Deposit amount <span className='text-purple-600 italic'> (in {genericChainValues.erc20Symbol || 'TOKEN'})</span>
      </label>
      <Input
        id='depositAmount'
        required
        disabled={disabled}
        type='number'
        pattern='\d+'
        onChange={(e) => setDepositAmount(e.target.value)}
        value={depositAmount}
      />

      {overBalance && <>
        <div className='text-yellow-400'>
          You only have {displayAmountInEther(usersERC20Balance, { decimals: erc20Decimals })} {tokenSymbol}.
          <br />The maximum you can deposit is {displayAmountInEther(usersERC20Balance, { precision: 2, decimals: erc20Decimals })}.
        </div>
      </>}

      <div
        className='my-5'
      >
        <Button
          disabled={overBalance}
          color='green'
        >
          Deposit
        </Button>
      </div>
    </form>
  </>
}
