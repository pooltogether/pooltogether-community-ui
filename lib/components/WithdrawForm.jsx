import React from 'react'
import { ethers } from 'ethers'

import { Button } from 'lib/components/Button'
import { Input } from 'lib/components/Input'
import { FormLockedOverlay } from 'lib/components/FormLockedOverlay'
import { RadioInputGroup } from 'lib/components/RadioInputGroup'
import { TextInputGroup } from 'lib/components/TextInputGroup'

import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

export const WithdrawForm = (props) => {
  const {
    exitFee,
    genericChainValues,
    handleSubmit,
    vars,
    stateSetters,
    usersChainValues,
  } = props

  const {
    usersTicketBalance,
  } = usersChainValues || {}

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

  const {
    tokenDecimals,
  } = genericChainValues || {}
  
  const poolIsLocked = genericChainValues.isRngRequested
  const tokenSymbol = genericChainValues.tokenSymbol || 'TOKEN'

  let instantTotal = ethers.utils.bigNumberify(0)
  if (withdrawAmount && exitFee && withdrawType === 'instant') {
    instantTotal = ethers.utils.parseUnits(withdrawAmount, tokenDecimals).sub(exitFee)
  }

  const overBalance = withdrawAmount && usersTicketBalance && usersTicketBalance.lt(
    ethers.utils.parseUnits(withdrawAmount, tokenDecimals)
  )
  
  return <>
    <form
      onSubmit={handleSubmit}
    >
      {poolIsLocked && <FormLockedOverlay
        title='Withdrawal'
      >
        <div>
          The Pool is currently being awarded and until awarding is complete can not accept withdrawals.
        </div>
      </FormLockedOverlay>}

      {!poolIsLocked && usersTicketBalance && usersTicketBalance.lte(0) && <FormLockedOverlay
        title='Withdraw'
      >
        You have no tickets to withdraw. Deposit some {genericChainValues.tokenSymbol || 'TOKEN'} first!
      </FormLockedOverlay>}

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

      <RadioInputGroup
        label='What type of withdraw?'
        name='withdrawType'
        onChange={handleWithdrawTypeChange}
        value={withdrawType}
        radios={[
          {
            value: 'scheduled',
            label: 'scheduled'
          },
          {
            value: 'instant',
            label: 'instant'
          }
        ]}
      />


      <TextInputGroup
        id='withdrawAmount'
        label={<>
          Withdraw amount <span className='text-purple-600 italic'> (in {genericChainValues.tokenSymbol || 'TOKEN'})</span>
        </>}
        required
        type='number'
        pattern='\d+'
        onChange={(e) => setWithdrawAmount(e.target.value)}
        value={withdrawAmount}
      />

      {exitFee && withdrawType === 'instant' && <>
        <div className='text-yellow-400'>
          You will receive {displayAmountInEther(
            instantTotal, { decimals: tokenDecimals }
          )} {tokenSymbol} now and forfeit {displayAmountInEther(exitFee)} as interest
        </div>

        {exitFee.eq(0) && <>
          Why is the fairness fee $0?
          <br/>
          The fairness fee is based on the previous prize and other factors (see documentation or contract code).
          <br/>
          You may want to pay fairness fee's for your users and/or hide the fairness fee when it's $0.
        </>}
      </>}

      {overBalance && <>
        <div className='text-yellow-400'>
          You only have {displayAmountInEther(usersTicketBalance, { decimals: tokenDecimals })} tickets.
          <br />The maximum you can withdraw is {displayAmountInEther(usersTicketBalance, { precision: 2, decimals: tokenDecimals })} {tokenSymbol}.
        </div>
      </>}

      <div
        className='my-5'
      >
        <Button
          disabled={overBalance}
          color='green'
        >
          Withdraw
        </Button>
      </div>
    </form>
  </>
}
