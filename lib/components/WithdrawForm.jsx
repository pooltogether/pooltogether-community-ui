import React from 'react'
import { ethers } from 'ethers'
import { useAtom } from 'jotai'

import { Button } from 'lib/components/Button'
import { PTHint } from 'lib/components/PTHint'
import { RadioInputGroup } from 'lib/components/RadioInputGroup'
import { TextInputGroup } from 'lib/components/TextInputGroup'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { poolChainValuesAtom } from 'lib/hooks/usePoolChainValues'
import { userChainValuesAtom } from 'lib/hooks/useUserChainValues'
import { InnerCard } from 'lib/components/Card'

import Warning from 'assets/images/warning.svg'

export const WithdrawForm = (props) => {
  const { exitFees, handleSubmit, vars, stateSetters } = props

  const [poolChainValues] = useAtom(poolChainValuesAtom)
  const [usersChainValues] = useAtom(userChainValuesAtom)

  const { usersTicketBalance } = usersChainValues || {}

  const { burnedCredit, exitFee, timelockDurationSeconds } = exitFees || {}

  const { withdrawAmount, withdrawType } = vars

  const { setWithdrawAmount, setWithdrawType } = stateSetters

  const handleWithdrawTypeChange = (e) => {
    setWithdrawType(e.target.value)
  }

  const { isRngRequested, tokenDecimals } = poolChainValues || {}

  const poolIsLocked = isRngRequested
  const tokenSymbol = poolChainValues.tokenSymbol || 'TOKEN'
  const ticketSymbol = poolChainValues.ticketSymbol || 'TICK'

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
    overBalance = withdrawAmount && usersTicketBalance && usersTicketBalance.lt(withdrawAmountBN)
  } catch (e) {
    console.error(e)
  }

  let ticketBal = ethers.utils.bigNumberify(0)
  if (usersTicketBalance) {
    ticketBal = ethers.utils.formatUnits(usersTicketBalance, tokenDecimals)
  }

  const timelockCredit = '?'

  if (poolIsLocked) {
    return (
      <InnerCard className='text-center'>
        <img src={Warning} className='w-10 sm:w-14 mx-auto mb-4' />
        <div className='text-accent-1 mb-4'>
          This Prize Pool is unable to withdraw at this time.
        </div>
        <div className='text-accent-1'>Withdraws can be made once the prize has been awarded.</div>
        <div className='text-accent-1'>Check back soon!</div>
      </InnerCard>
    )
  }

  if (!poolIsLocked && usersTicketBalance && usersTicketBalance.lte(0)) {
    return (
      <div className='text-orange-600'>
        You have no tickets to withdraw. Deposit some {tokenSymbol} first!
      </div>
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <RadioInputGroup
          label={
            <>
              <div className='text-sm'>
                What type of withdraw?{' '}
                <PTHint
                  title='On fairness fees'
                  tip={
                    <>
                      <div className='my-2 text-xs sm:text-sm'>
                        To maintain fairness your funds need to contribute interest towards the
                        prize each week. You can:
                      </div>
                      {/* <div className='my-2 text-xs sm:text-sm'>
                        1) SCHEDULE: receive $1000 DAI once enough interest has been provided to the
                        prize
                      </div> */}
                      <div className='my-2 text-xs sm:text-sm'>
                        INSTANT: pay $1.90 to withdraw right now and forfeit the interest that
                        would go towards the prize
                      </div>
                    </>
                  }
                />
              </div>
            </>
          }
          name='withdrawType'
          onChange={handleWithdrawTypeChange}
          value={withdrawType}
          radios={[
            // {
            //   value: 'scheduled',
            //   label: 'scheduled'
            // },
            {
              value: 'instant',
              label: 'instant'
            }
          ]}
        />

        <TextInputGroup
          id='withdrawAmount'
          name='withdrawAmount'
          label='Withdraw amounts'
          required
          type='number'
          pattern='\d+'
          unit={tokenSymbol}
          onChange={(e) => setWithdrawAmount(e.target.value)}
          value={withdrawAmount}
          rightLabel={
            tokenSymbol && (
              <>
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
              </>
            )
          }
        />

        {overBalance && (
          <>
            <div className='text-yellow-1'>
              You only have {displayAmountInEther(usersTicketBalance, { decimals: tokenDecimals })}{' '}
              tickets.
              <br />
              The maximum you can withdraw is{' '}
              {displayAmountInEther(usersTicketBalance, {
                precision: 2,
                decimals: tokenDecimals
              })}{' '}
              {tokenSymbol}.
            </div>
          </>
        )}

        {!overBalance && exitFee && withdrawType === 'instant' && (
          <>
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
            <div className='text-yellow-1'>
              You will receive {displayAmountInEther(instantTotal, { decimals: tokenDecimals })}{' '}
              {tokenSymbol} now&nbsp;
              {exitFee.eq(0) ? (
                <>
                  and burn {displayAmountInEther(burnedCredit, { decimals: tokenDecimals })} from
                  your credit
                </>
              ) : (
                <>
                  and forfeit {displayAmountInEther(exitFee, { decimals: tokenDecimals })}{' '}
                  {tokenSymbol} as interest
                </>
              )}
            </div>

            {exitFee.eq(0) && (
              <>
                <div className='text-sm text-default my-6'>
                  <em className='text-white'>Why is the fairness fee $0?</em>
                  <br />
                  <br />
                  The fairness fee is based on the previous prize and other factors (see
                  documentation or contract code).
                  <br />
                  <br />
                  You may want to pay fairness fee's on behalf of your users and/or hide the
                  fairness fee when it's $0.
                </div>
              </>
            )}
          </>
        )}

        {!overBalance && timelockDurationSeconds && withdrawType !== 'instant' && (
          <>
            <div className='text-yellow-1'>
              You will receive {displayAmountInEther(instantTotal, { decimals: tokenDecimals })}{' '}
              {tokenSymbol}&nbsp;
              {timelockDurationSeconds.eq(0) ? (
                <>
                  now and burn {timelockCredit} {tokenSymbol} from your credit
                </>
              ) : (
                <>
                  in {numberWithCommas(timelockDurationSeconds, { precision: 0 }).toString()}{' '}
                  seconds
                </>
              )}
            </div>
          </>
        )}

        <div className='my-5'>
          <Button disabled={overBalance} color='warning' size='lg'>
            Withdraw
          </Button>
        </div>
      </form>
    </>
  )
}
