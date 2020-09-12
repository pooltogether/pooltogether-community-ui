import React from 'react'
import { ethers } from 'ethers'

import { Button } from 'lib/components/Button'
import { Input } from 'lib/components/Input'
import { FormLockedOverlay } from 'lib/components/FormLockedOverlay'
import { RadioInputGroup } from 'lib/components/RadioInputGroup'
import { TextInputGroup } from 'lib/components/TextInputGroup'

import { PTHint } from 'lib/components/PTHint'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

export const WithdrawForm = (props) => {
  const {
    exitFees,
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
    instantCredit,
    instantFee,
    timelockCredit,
    timelockDuration,
  } = exitFees || {}

  const {
    maxExitFee,
    withdrawAmount,
    withdrawType,
  } = vars
  const {
    setMaxExitFee,
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
  if (withdrawAmount) {
    if (instantFee && instantFee.gt(0) && withdrawType === 'instant') {
      instantTotal = ethers.utils.parseUnits(withdrawAmount, tokenDecimals).sub(instantFee)
    } else {
      instantTotal = ethers.utils.parseUnits(withdrawAmount, tokenDecimals)
    }
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

      <RadioInputGroup
        label={<>
          What type of withdraw? <PTHint
            title='On fairness fees'
            tip={<>
              <div className='my-2 text-xs sm:text-sm'>
                To maintain fairness your funds need to contribute interest towards the prize each week. You can:
          </div>
              <div className='my-2 text-xs sm:text-sm'>
                1) SCHEDULE: receive $1000 DAI once enough interest has been provided to the prize
          </div>
              <div className='my-2 text-xs sm:text-sm'>
                2) INSTANT: pay $1.90 to withdraw right now and forfeit the interest that would go towards the prize
          </div>
            </>}
          />
        </>}
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
          Withdraw amount <span className='text-default italic'> (in ${genericChainValues.ticketSymbol || 'TICK'} tickets)</span>
        </>}
        required
        type='number'
        pattern='\d+'
        onChange={(e) => setWithdrawAmount(e.target.value)}
        value={withdrawAmount}
      />

      {overBalance && <>
        <div className='text-yellow'>
          You only have {displayAmountInEther(usersTicketBalance, { decimals: tokenDecimals })} tickets.
          <br />The maximum you can withdraw is {displayAmountInEther(usersTicketBalance, { precision: 2, decimals: tokenDecimals })} {tokenSymbol}.
        </div>
      </>}

      {!overBalance && instantFee && withdrawType === 'instant' && <>
        {/* <TextInputGroup
          id='maxExitFee'
          label={<>
            Max Exit Fee <span className='text-default italic'> (in {genericChainValues.tokenSymbol || 'TOKEN'})</span>
          </>}
          required
          type='number'
          pattern='\d+'
          onChange={(e) => setMaxExitFee(e.target.value)}
          value={maxExitFee}
        />
 */}
        <div className='text-yellow'>
          You will receive {displayAmountInEther(instantTotal, { decimals: tokenDecimals })} {tokenSymbol} now&nbsp;
          {
            instantFee.eq(0)
              ? <>and burn {displayAmountInEther(instantCredit)} from your credit</>
              : <>and forfeit {displayAmountInEther(instantFee, { decimals: tokenDecimals })} as interest</>
          }
        </div>

        {instantFee.eq(0) && <>
          <div
            className='text-sm text-default my-6'
          >
            <em className='text-white'>Why is the fairness fee $0?</em>
            <br /><br />
            The fairness fee is based on the previous prize and other factors (see documentation or contract code).
            <br /><br />
            You may want to pay fairness fee's on behalf of your users and/or hide the fairness fee when it's $0.
          </div>
        </>}
      </>}

      {!overBalance && timelockDuration && withdrawType !== 'instant' && <>
        <div className='text-yellow'>
          You will receive {displayAmountInEther(instantTotal, { decimals: tokenDecimals })} {tokenSymbol}&nbsp;
          {
            timelockDuration.eq(0)
              ? <>now and burn {displayAmountInEther(timelockCredit)} {tokenSymbol} from your credit</>
              : <>in {timelockDuration.toString()} seconds</>
          }
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
