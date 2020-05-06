import React from 'react'
import classnames from 'classnames'

import { Button } from 'lib/components/Button'
import { Input } from 'lib/components/Input'

export const WithdrawForm = (props) => {
  const {
    handleSubmit,
    vars,
    stateSetters,
  } = props

  let withdrawAmount, setWithdrawAmount
  if (vars && stateSetters) {
    withdrawAmount = vars.withdrawAmount
    setWithdrawAmount = vars.setWithdrawAmount
  }

  return <>
    <form
      onSubmit={handleSubmit}
    >
      <div
        className='font-bold mb-4 py-2 text-lg sm:text-xl lg:text-2xl'
      >
        Make a withdraw:
      </div>

      <label
        htmlFor='withdrawAmount'
        className='trans text-purple-300 hover:text-white'
      >
        Withdraw amount <span className='text-purple-600 italic'> (in DAI)</span>
      </label>
      <Input
        id='withdrawAmount'
        required
        type='number'
        pattern='\d+'
        onChange={(e) => setWithdrawAmount(e.target.value)}
        value={withdrawAmount}
      />

      <div
        className='mt-10 mb-0'
      >
        <Button>
          Withdraw
        </Button>
      </div>
    </form>
  </>
}
