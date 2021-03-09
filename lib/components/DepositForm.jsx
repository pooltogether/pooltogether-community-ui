import React, { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import IERC20Abi from '@pooltogether/pooltogether-contracts/abis/IERC20Upgradeable'
import { useAtom } from 'jotai'
import FeatherIcon from 'feather-icons-react'

import { Button } from 'lib/components/Button'
import { RightLabelButton, TextInputGroup } from 'lib/components/TextInputGroup'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { fetchPoolChainValues, poolChainValuesAtom } from 'lib/hooks/usePoolChainValues'
import { userChainValuesAtom } from 'lib/hooks/useUserChainValues'
import { sendTx } from 'lib/utils/sendTx'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { poolAddressesAtom } from 'lib/hooks/usePoolAddresses'
import { contractVersionsAtom, prizePoolTypeAtom } from 'lib/hooks/useDetermineContractVersions'
import { errorStateAtom } from 'lib/components/PoolData'
import { useNetwork } from 'lib/hooks/useNetwork'
import { InnerCard } from 'lib/components/Card'

import Warning from 'assets/images/warning.svg'
import { getErc20InputProps } from 'lib/utils/getErc20InputProps'

export const DepositForm = (props) => {
  const { handleSubmit, vars, stateSetters } = props

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
    console.warn(e)
  }

  const tokenBal =
    usersTokenBalance && tokenDecimals
      ? ethers.utils.formatUnits(usersTokenBalance, tokenDecimals)
      : ''

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
          disabled={!hasApprovedBalance}
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
              {numberWithCommas(tokenBal, { precision: tokenDecimals, removeTrailingZeros: true })}{' '}
              {tokenSymbol}
            </RightLabelButton>
          }
        />
      </div>
      {overBalance && (
        <div className='text-yellow-1'>
          You only have{' '}
          {displayAmountInEther(usersTokenBalance, {
            precision: tokenDecimals,
            decimals: tokenDecimals
          })}{' '}
          {tokenSymbol}.
          <br />
          The maximum you can deposit is{' '}
          {displayAmountInEther(usersTokenBalance, {
            precision: tokenDecimals,
            decimals: tokenDecimals
          })}
          .
        </div>
      )}
      <div className='my-5 flex flex-col sm:flex-row'>
        <UnlockDepositsButton />
        <Button
          size='lg'
          fullWidth
          disabled={overBalance || !hasApprovedBalance}
          color='secondary'
          className='sm:ml-4'
        >
          Deposit
        </Button>
      </div>
    </form>
  )
}

const UnlockDepositsButton = () => {
  const [poolChainValues, setPoolChainValues] = useAtom(poolChainValuesAtom)
  const [usersChainValues] = useAtom(userChainValuesAtom)
  const [contractVersions] = useAtom(contractVersionsAtom)
  const [chainId] = useNetwork()
  const [errorState, setErrorState] = useAtom(errorStateAtom)
  const [poolAddresses] = useAtom(poolAddressesAtom)
  const [prizePoolType] = useAtom(prizePoolTypeAtom)
  const [tx, setTx] = useState({})
  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider
  const hasApprovedBalance = usersChainValues.usersTokenAllowance.gt(0)

  // Reset on network change
  useEffect(() => {
    setTx({})
  }, [chainId])

  // Update global data upon completion
  useEffect(() => {
    if (tx.completed && !tx.error) {
      fetchPoolChainValues(
        provider,
        poolAddresses,
        prizePoolType,
        setPoolChainValues,
        contractVersions.prizeStrategy.contract,
        setErrorState
      )
    }
  }, [tx.completed, tx.error])

  if (hasApprovedBalance || (tx.completed && !tx.error)) {
    return (
      <Button
        disabled
        type='button'
        color='secondary'
        fullWidth
        size='lg'
        className='mb-4 sm:mb-0 mr-4'
      >
        <FeatherIcon
          icon='check-circle'
          className='relative w-4 h-4 inline-block my-auto mr-2 my-auto'
          strokeWidth='0.15rem'
        />
        {`Approved ${poolChainValues.tokenSymbol}`}
      </Button>
    )
  }

  let buttonText = `Approve ${poolChainValues.tokenSymbol}`
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
          poolAddresses.token,
          poolAddresses.prizePool,
          poolChainValues.tokenDecimals
        )
      }}
      type='button'
      color='secondary'
      fullWidth
      size='lg'
      className='mb-4 sm:mb-0 sm:mr-4'
    >
      {buttonText}
    </Button>
  )
}

const handleUnlockSubmit = async (setTx, provider, contractAddress, prizePoolAddress, decimals) => {
  const params = [prizePoolAddress, ethers.utils.parseUnits('1000000000', decimals)]

  await sendTx(setTx, provider, contractAddress, IERC20Abi, 'approve', params, 'Unlock Deposits')
}
