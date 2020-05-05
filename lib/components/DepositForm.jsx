import React from 'react'

import { Button } from 'lib/components/Button'
import { Input } from 'lib/components/Input'

export const DepositForm = (props) => {
  const {
    handleSubmit,
    vars,
    stateSetters,
  } = props

  const {
    depositAmount,
  } = vars

  const {
    setDepositAmount,
  } = stateSetters

  return <>
    <form
      onSubmit={handleSubmit}
    >
      <div
        className='font-bold mb-8 py-2 text-lg sm:text-xl lg:text-2xl'
      >
        Make a deposit:
      </div>

      <label
        htmlFor='depositAmount'
        className='text-purple-300 hover:text-white trans'
      >
        Deposit amount <span className='text-purple-600 italic'> (in DAI)</span>
      </label>
      <Input
        id='depositAmount'
        required
        autoFocus
        type='number'
        pattern='\d+'
        onChange={(e) => setDepositAmount(e.target.value)}
        value={depositAmount}
      />

      <div
        className='mt-10 mb-0'
      >
        <Button>
          Deposit        
        </Button>
      </div>
    </form>
  </>
}
