import React, { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import IERC20Abi from '@pooltogether/pooltogether-contracts/abis/IERC20Upgradeable'
import FeatherIcon from 'feather-icons-react'

import { Button } from 'lib/components/Button'
import { RightLabelButton, TextInputGroup } from 'lib/components/TextInputGroup'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { useUserChainValues } from 'lib/hooks/useUserChainValues'
import { sendTx } from 'lib/utils/sendTx'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { useNetwork } from 'lib/hooks/useNetwork'
import { InnerCard } from 'lib/components/Card'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

import Warning from 'assets/images/warning.svg'
import { getErc20InputProps } from 'lib/utils/getErc20InputProps'
import { usePoolChainValues } from 'lib/hooks/usePoolChainValues'
import { usePrizePoolContracts } from 'lib/hooks/usePrizePoolContracts'
import { usePrizePoolType } from 'lib/hooks/usePrizePoolType'

export const DepositForm = (props) => {
  const { inputError, handleSubmit, vars, stateSetters } = props

  const { walletMatchesNetwork } = useNetwork()
  const { data: poolChainValues, isFetched: poolChainValuesIsFetched } = usePoolChainValues()
  const { data: usersChainValues, isFetched: usersChainValuesIsFetched } = useUserChainValues()

  if (!poolChainValuesIsFetched || !usersChainValuesIsFetched) return null

  const hasApprovedBalance = usersChainValues.underlyingTokenIsApproved
  const supportsAllowance = usersChainValues.underlyingTokenSupportsAllowance
  const { usersTokenBalance, usersTokenBalanceUnformatted } = usersChainValues
  const { symbol: tokenSymbol, decimals: tokenDecimals } = poolChainValues.token.symbol
  const poolIsLocked = poolChainValues.prize.isRngRequested

  let depositAmount, setDepositAmount
  if (vars && stateSetters) {
    depositAmount = vars.depositAmount
    setDepositAmount = stateSetters.setDepositAmount
  }

  let depositAmountBN
  let overBalance = false
  try {
    depositAmountBN = ethers.utils.parseUnits(depositAmount || '0', tokenDecimals)
    overBalance =
      depositAmountBN &&
      usersTokenBalanceUnformatted &&
      usersTokenBalanceUnformatted.lt(depositAmountBN)
  } catch (e) {
    console.warn(e)
  }

  const tokenBal = usersTokenBalance

  if (poolIsLocked) {
    return (
      <InnerCard className='text-center'>
        <img src={Warning} className='w-10 sm:w-14 mx-auto mb-4' />
        <div className='text-accent-1 mb-4'>
          This Prize Pool is not accepting deposits at this time.
        </div>
        <div className='text-accent-1'>Deposits can be made once the prize has been awarded.</div>
        <div className='text-accent-1'>Check back soon!</div>
      </InnerCard>
    )
  }

  const { min, step } = getErc20InputProps(tokenDecimals)

  return (
    <form onSubmit={handleSubmit}>
      <div className='w-full mx-auto'>
        <TextInputGroup
          id='depositAmount'
          name='depositAmount'
          label='Deposit amount'
          unit={tokenSymbol}
          required
          disabled={(supportsAllowance && !hasApprovedBalance) || !walletMatchesNetwork}
          type='number'
          min={min}
          step={step}
          onChange={(e) => setDepositAmount(e.target.value)}
          value={depositAmount}
          rightLabel={
            <RightLabelButton
              onClick={(e) => {
                e.preventDefault()
                setDepositAmount(tokenBal)
              }}
            >
              {numberWithCommas(usersTokenBalanceUnformatted, { decimals: tokenDecimals })}{' '}
              {tokenSymbol}
            </RightLabelButton>
          }
        />
      </div>

      {inputError && (
        <div className='text-xs sm:text-sm text-red-600 sm:ml-4'>
          The amount you entered is invalid.
        </div>
      )}

      {overBalance && (
        <div className='text-yellow-1'>
          You only have{' '}
          {displayAmountInEther(usersTokenBalance, {
            precision: tokenDecimals,
            decimals: tokenDecimals
          })}{' '}
          {tokenSymbol}. The maximum you can deposit is{' '}
          {displayAmountInEther(usersTokenBalance, {
            precision: tokenDecimals,
            decimals: tokenDecimals
          })}
          .
        </div>
      )}

      <div className='my-5 flex flex-col sm:flex-row justify-end'>
        <UnlockDepositsButton />
        <Button
          size='lg'
          fullWidth
          disabled={inputError || overBalance || !hasApprovedBalance || !walletMatchesNetwork}
          color='secondary'
          className='sm:ml-4 w-full sm:w-1/2'
        >
          Deposit
        </Button>
      </div>
    </form>
  )
}

const UnlockDepositsButton = () => {
  const { data: poolChainValues, refetch: refetchPoolChainValues } = usePoolChainValues()
  const { data: usersChainValues, refetch: refetchUsersChainValues } = useUserChainValues()
  const { data: prizePoolContracts } = usePrizePoolContracts()

  const { chainId, walletMatchesNetwork } = useNetwork()
  const [tx, setTx] = useState({})
  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider
  const hasApprovedBalance = usersChainValues.underlyingTokenIsApproved
  const underlyingTokenSupportsAllowance = usersChainValues.underlyingTokenSupportsAllowance

  // Reset on network change
  useEffect(() => {
    setTx({})
  }, [chainId])

  // Update global data upon completion
  useEffect(() => {
    if (tx.completed && !tx.error) {
      refetchPoolChainValues()
      refetchUsersChainValues()
    }
  }, [tx.completed, tx.error])

  if (!underlyingTokenSupportsAllowance) return null

  if (hasApprovedBalance || (tx.completed && !tx.error)) {
    return (
      <Button
        disabled
        type='button'
        color='secondary'
        fullWidth
        size='lg'
        className='mb-4 sm:mb-0 mr-4 w-full sm:w-1/2'
      >
        <FeatherIcon
          icon='check-circle'
          className='relative w-4 h-4 inline-block my-auto mr-2'
          strokeWidth='0.15rem'
        />
        {`Approved ${poolChainValues.token.symbol}`}
      </Button>
    )
  }

  let buttonText = `Approve ${poolChainValues.token.symbol}`
  if (tx.sent && !tx.completed) {
    buttonText = 'Waiting for confirmations...'
  }
  if (tx.inWallet && !tx.completed) {
    buttonText = 'Transaction Pending...'
  }

  return (
    <Button
      onClick={(e) => {
        e.preventDefault()

        if (tx.inWallet) return

        handleUnlockSubmit(
          setTx,
          provider,
          prizePoolContracts.token.address,
          prizePoolContracts.prizePool.address,
          poolChainValues.token.symbol
        )
      }}
      disabled={!walletMatchesNetwork}
      type='button'
      color='secondary'
      fullWidth
      size='lg'
      className='mb-4 sm:mb-0 sm:mr-4 w-full sm:w-1/2'
    >
      {buttonText}
    </Button>
  )
}

const handleUnlockSubmit = async (setTx, provider, contractAddress, prizePoolAddress, decimals) => {
  const params = [prizePoolAddress, ethers.utils.parseUnits('1000000000', decimals)]

  await sendTx(setTx, provider, contractAddress, IERC20Abi, 'approve', params, 'Unlock Deposits')
}
