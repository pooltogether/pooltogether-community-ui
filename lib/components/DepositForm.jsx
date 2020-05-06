import React from 'react'
import classnames from 'classnames'

import { Button } from 'lib/components/Button'
import { Input } from 'lib/components/Input'

export const DepositForm = (props) => {
  const {
    handleSubmit,
    vars,
    stateSetters,
    disabled,
  } = props

  let depositAmount, setDepositAmount
  if (vars && stateSetters) {
    depositAmount = vars.depositAmount
    setDepositAmount = vars.setDepositAmount
  }

  return <>
    <form
      onSubmit={handleSubmit}
    >
      <div
        className='font-bold mb-8 py-2 text-lg sm:text-xl lg:text-2xl'
      >
        Make a deposit:
      </div>

      {disabled && <>
        <div
          className='bg-purple-800 rounded-lg text-center w-3/4 mx-auto px-4 py-3 text-sm sm:text-base lg:text-lg text-purple-300'
        >
          Unlock deposits first by providing the pool with a DAI spend allowance.
        </div>
      </>}

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
        Deposit amount <span className='text-purple-600 italic'> (in DAI)</span>
      </label>
      <Input
        id='depositAmount'
        required
        autoFocus
        disabled={disabled}
        type='number'
        pattern='\d+'
        onChange={(e) => setDepositAmount(e.target.value)}
        value={depositAmount}
      />

      <div
        className='mt-10 mb-0'
      >
        <Button>
          {disabled ? 'Unlock Deposits' : 'Make Deposit'}
        </Button>
      </div>
    </form>
  </>
}
