import React from 'react'
import { ethers } from 'ethers'

import { Button } from 'lib/components/Button'
import { Input } from 'lib/components/Input'
// import { PTHint } from 'lib/components/PTHint'

import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

export const WithdrawForm = (props) => {
  const {
    exitFee,
    genericChainValues,
    handleSubmit,
    vars,
    stateSetters,
  } = props

  const {
    withdrawAmount,
    withdrawType,
  } = vars
  const {
    setWithdrawAmount,
    setWithdrawType,
  } = stateSetters

  const handleWithdrawTypeChange = (e) => {
    setWithdrawType(e.target.value)
  }

  const tokenSymbol = genericChainValues.erc20Symbol || 'TOKEN'

  let instantTotal = ethers.utils.bigNumberify(0)
  if (exitFee && withdrawType === 'instant') {
    instantTotal = ethers.utils.parseEther(withdrawAmount).sub(exitFee)
  }

  return <>
    <form
      onSubmit={handleSubmit}
      className='relative '
    >
      <div
        className='font-bold mb-2 py-2 text-lg sm:text-xl lg:text-2xl'
      >
        Withdraw:
      </div>
      {/* can't get this tooltip to render in the proper place atm: */}
      {/* <PTHint
        tip={`To maintain fairness your funds need to contribute interest towards the prize each week. You can:
1) SCHEDULE: receive $1000 DAI once enough interest has been provided to the prize
2) INSTANT: pay $1.90 to withdraw right now and forfeit the interest that would go towards the prize`}
      /> */}
      <label
        htmlFor='kovan-radio'
        className='text-purple-300 hover:text-white trans mt-0'
      >What type of withdraw?</label> 
      <div
        className='inputGroup w-full sm:w-10/12 text-base sm:text-xl lg:text-2xl'
      >
        <input
          id='scheduled-radio'
          name='radio'
          type='radio'
          onChange={handleWithdrawTypeChange}
          value='scheduled'
          checked={withdrawType === 'scheduled'}
        />
        <label
          htmlFor='scheduled-radio'
          className='text-purple-300 relative pl-6 py-3'
        >scheduled</label>
      </div>

      <div
        className='inputGroup w-full sm:w-10/12 text-base sm:text-xl lg:text-2xl'
      >
        <input
          id='instant-radio'
          name='radio'
          type='radio'
          onChange={handleWithdrawTypeChange}
          value='instant'
          checked={withdrawType === 'instant'}
        />
        <label
          htmlFor='instant-radio'
          className='text-purple-300 relative pl-6 py-3'
        >instant</label>
      </div>

      <label
        htmlFor='withdrawAmount'
        className='trans text-purple-300 hover:text-white'
      >
        Withdraw amount <span className='text-purple-600 italic'> (in {tokenSymbol})</span>
      </label>
      <Input
        id='withdrawAmount'
        required
        type='number'
        pattern='\d+'
        onChange={(e) => setWithdrawAmount(e.target.value)}
        value={withdrawAmount}
      />

      {exitFee && withdrawType === 'instant' && <>
        <div className='text-yellow-400'>
          You will receive {displayAmountInEther(instantTotal)} {tokenSymbol} now and forfeit {displayAmountInEther(exitFee)} as interest
        </div>
      </>}

      <div
        className='my-5'
      >
        <Button
          color='green'
        >
          Withdraw
        </Button>
      </div>
    </form>
  </>
}
