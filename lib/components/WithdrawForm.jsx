import React from 'react'
import { ethers } from 'ethers'

import { Button } from 'lib/components/Button'
import { FormLockedOverlay } from 'lib/components/FormLockedOverlay'
import { RadioInputGroup } from 'lib/components/RadioInputGroup'
import { TextInputGroup } from 'lib/components/TextInputGroup'

import { PTHint } from 'lib/components/PTHint'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

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
    burnedCredit,
    exitFee,
    timelockDurationSeconds,
  } = exitFees || {}

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
    isRngRequested,
    tokenDecimals,
  } = genericChainValues || {}

  const poolIsLocked = isRngRequested
  const tokenSymbol = genericChainValues.tokenSymbol || 'TOKEN'
  const ticketSymbol = genericChainValues.ticketSymbol || 'TICK'

  let instantTotal = ethers.utils.bigNumberify(0)
  if (withdrawAmount) {
    if (exitFee && exitFee.gt(0) && withdrawType === 'instant') {
      instantTotal = ethers.utils.parseUnits(withdrawAmount, tokenDecimals).sub(exitFee)
    } else {
      instantTotal = ethers.utils.parseUnits(withdrawAmount, tokenDecimals)
    }
  }

  let withdrawAmountBN
  let overBalance = false
  try {
    withdrawAmountBN = ethers.utils.parseUnits(withdrawAmount || '0', tokenDecimals)
    overBalance = withdrawAmount && usersTicketBalance && usersTicketBalance.lt(
      withdrawAmountBN
    )
  } catch (e) {
    console.error(e)
  }

  const ticketBal = ethers.utils.formatUnits(usersTicketBalance, tokenDecimals)

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
        You have no tickets to withdraw. Deposit some {tokenSymbol} first!
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
        name='withdrawAmount'
        label={<>
          Withdraw amount <span className='text-default italic'> (in {tokenSymbol})</span>
        </>}
        required
        type='number'
        pattern='\d+'
        onChange={(e) => setWithdrawAmount(e.target.value)}
        value={withdrawAmount}

        rightLabel={tokenSymbol && <>
          <button
            type='button'
            onClick={(e) => {
              e.preventDefault()
              setWithdrawAmount(ticketBal)
            }}
          >
            {/* Balance:  */}
              MAX - {numberWithCommas(ticketBal, { precision: 4 })} {tokenSymbol}
          </button>
        </>}
      />

      {overBalance && <>
        <div className='text-yellow'>
          You only have {displayAmountInEther(usersTicketBalance, { decimals: tokenDecimals })} tickets.
          <br />The maximum you can withdraw is {displayAmountInEther(usersTicketBalance, { precision: 2, decimals: tokenDecimals })} {tokenSymbol}.
        </div>
      </>}

      {!overBalance && exitFee && withdrawType === 'instant' && <>
        {/* <TextInputGroup
          id='maxExitFee'
          label={<>
            Max Exit Fee <span className='text-default italic'> (in {tokenSymbol})</span>
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
            exitFee.eq(0)
              ? <>and burn {displayAmountInEther(burnedCredit, { decimals: tokenDecimals })} from your credit</>
              : <>and forfeit {displayAmountInEther(exitFee, { decimals: tokenDecimals })} {tokenSymbol} as interest</>
          }
        </div>

        {exitFee.eq(0) && <>
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

      {!overBalance && timelockDurationSeconds && withdrawType !== 'instant' && <>
        <div className='text-yellow'>
          You will receive {displayAmountInEther(instantTotal, { decimals: tokenDecimals })} {tokenSymbol}&nbsp;
          {
            timelockDurationSeconds.eq(0)
              ? <>now and burn {displayAmountInEther(timelockCredit)} {tokenSymbol} from your credit</>
              : <>in {numberWithCommas(timelockDurationSeconds, { precision: 0 }).toString()} seconds</>
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
