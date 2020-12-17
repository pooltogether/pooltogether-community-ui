import React from 'react'
import { ethers } from 'ethers'
import FeatherIcon from 'feather-icons-react'

import { Button } from 'lib/components/Button'
import { FormLockedOverlay } from 'lib/components/FormLockedOverlay'
import { TextInputGroup } from 'lib/components/TextInputGroup'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { useAtom } from 'jotai'
import { poolChainValuesAtom } from 'lib/hooks/usePoolChainValues'
import { userChainValuesAtom } from 'lib/hooks/useUserChainValues'

export const DepositForm = (props) => {
  const { handleSubmit, vars, stateSetters, disabled } = props

  const [poolChainValues] = useAtom(poolChainValuesAtom)
  const [usersChainValues] = useAtom(userChainValuesAtom)

  const { usersTokenBalance } = usersChainValues || {}

  const { tokenDecimals, isRngRequested } = poolChainValues || {}

  const poolIsLocked = isRngRequested
  const tokenSymbol = poolChainValues.tokenSymbol || 'TOKEN'

  let depositAmount, setDepositAmount
  if (vars && stateSetters) {
    depositAmount = vars.depositAmount
    setDepositAmount = stateSetters.setDepositAmount
  }

  let depositAmountBN
  let overBalance = false
  try {
    depositAmountBN = ethers.utils.parseUnits(depositAmount || '0', tokenDecimals)
    overBalance = depositAmountBN && usersTokenBalance && usersTokenBalance.lt(depositAmountBN)
  } catch (e) {
    console.error(e)
  }

  const tokenBal = ethers.utils.formatUnits(usersTokenBalance, tokenDecimals)

  return (
    <>
      <form onSubmit={handleSubmit}>
        {poolIsLocked && (
          <FormLockedOverlay title='Deposit'>
            <div>
              The Pool is currently being awarded and until awarding is complete can not accept
              withdrawals.
            </div>
          </FormLockedOverlay>
        )}

        {disabled && (
          <FormLockedOverlay title='Deposit'>
            <div>
              Unlock deposits by first approving the pool's ticket contract to have a DAI allowance.
            </div>

            <div className='mt-3 sm:mt-5 mb-5'>
              <Button size='sm' color='green'>
                Unlock Deposits
              </Button>
            </div>
          </FormLockedOverlay>
        )}

        <div className='w-full mx-auto'>
          <TextInputGroup
            id='depositAmount'
            name='depositAmount'
            label={
              <>
                Deposit amount <span className='text-default italic'> (in {tokenSymbol})</span>
              </>
            }
            required
            disabled={disabled}
            type='number'
            pattern='\d+'
            onChange={(e) => setDepositAmount(e.target.value)}
            value={depositAmount}
            rightLabel={
              tokenSymbol && (
                <button
                  type='button'
                  onClick={(e) => {
                    e.preventDefault()
                    setDepositAmount(tokenBal)
                  }}
                >
                  {/* Balance:  */}
                  MAX - {numberWithCommas(tokenBal, { precision: 4 })} {tokenSymbol}
                </button>
              )
            }
          />
        </div>
        {overBalance && (
          <div className='text-yellow-1'>
            You only have {displayAmountInEther(usersTokenBalance, { decimals: tokenDecimals })}{' '}
            {tokenSymbol}.
            <br />
            The maximum you can deposit is{' '}
            {displayAmountInEther(usersTokenBalance, { precision: 2, decimals: tokenDecimals })}.
          </div>
        )}
        <div className='my-5'>
          <Button size='xl' disabled={overBalance} color='primary'>
            Deposit
          </Button>
        </div>
      </form>
      <div className='flex flex-col'>
        <Button size='xl' disabled={overBalance} color='primary'>
          Test
        </Button>
        <Button size='xl' disabled={overBalance} color='secondary'>
          Test
        </Button>
        <Button size='xl' disabled={overBalance} color='tertiary'>
          Test
        </Button>
        <Button size='xl' disabled={overBalance} color='danger'>
          Test
        </Button>
        <Button size='xl' color='primary' disabled>
          Test
        </Button>
      </div>
    </>
  )
}
