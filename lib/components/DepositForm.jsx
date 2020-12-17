import React, { useContext, useState } from 'react'
import { ethers } from 'ethers'
import IERC20Abi from '@pooltogether/pooltogether-contracts/abis/IERC20Upgradeable'
import { useAtom } from 'jotai'
import FeatherIcon from 'feather-icons-react'

import { Button } from 'lib/components/Button'
import { FormLockedOverlay } from 'lib/components/FormLockedOverlay'
import { TextInputGroup } from 'lib/components/TextInputGroup'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { poolChainValuesAtom } from 'lib/hooks/usePoolChainValues'
import { userChainValuesAtom } from 'lib/hooks/useUserChainValues'
import { sendTx } from 'lib/utils/sendTx'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { poolAddressesAtom } from 'lib/hooks/usePoolAddresses'

export const DepositForm = (props) => {
  const { handleSubmit, vars, stateSetters, disabled } = props

  const [poolChainValues] = useAtom(poolChainValuesAtom)
  const [usersChainValues] = useAtom(userChainValuesAtom)
  const hasApprovedBalance = usersChainValues.usersTokenAllowance.gt(0)

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
            <Button size='sm' color='secondary'>
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
      <div className='my-5 flex flex-row'>
        <UnlockDepositsButton />
        <Button
          size='lg'
          fullWidth
          disabled={overBalance || !hasApprovedBalance}
          color='secondary'
          className='ml-4'
        >
          Deposit
        </Button>
      </div>
    </form>
  )
}

const UnlockDepositsButton = () => {
  const [poolChainValues] = useAtom(poolChainValuesAtom)
  const [usersChainValues] = useAtom(userChainValuesAtom)
  const [poolAddresses] = useAtom(poolAddressesAtom)
  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider

  const [tx, setTx] = useState({})

  if (tx.sent && !tx.completed) {
  }
  if (true) {
    // if (tx.inWallet && !tx.completed) {
    return (
      <Button disabled type='button' color='secondary' fullWidth size='lg' className='mr-4'>
        <FeatherIcon
          icon='check-circle'
          className='relative w-4 h-4 sm:w-8 sm:h-8 inline-block my-auto'
          strokeWidth='0.15rem'
        />
        Approved Dai
      </Button>
    )
  }
  // TODO: Error state

  const hasApprovedBalance = usersChainValues.usersTokenAllowance.gt(0)

  return (
    <Button
      onClick={(e) => {
        e.preventDefault()

        handleUnlockSubmit(
          setTx,
          provider,
          poolAddresses.token,
          poolAddresses.prizePool,
          poolChainValues.tokenDecimals
        )
      }}
      type='button'
      color='secondary'
      fullWidth
      size='lg'
      className='mr-4'
    >
      Approve Dai
    </Button>
  )
}

const handleUnlockSubmit = async (setTx, provider, contractAddress, prizePoolAddress, decimals) => {
  const params = [
    prizePoolAddress,
    ethers.utils.parseUnits('1000000000', decimals),
    {
      gasLimit: 200000
    }
  ]

  await sendTx(setTx, provider, contractAddress, IERC20Abi, 'approve', params, 'Unlock Deposits')
}
