import React, { useEffect, useState } from 'react'

import { TxMessage } from 'lib/components/TxMessage'
import { WithdrawForm } from 'lib/components/WithdrawForm'
import { useUsersAddress } from '@pooltogether/hooks'
import { ConnectWalletButton } from 'lib/components/ConnectWalletButton'
import { usePoolChainValues } from 'lib/hooks/usePoolChainValues'
import { useOnTransactionCompleted } from 'lib/hooks/useOnTransactionCompleted'
import { useUserChainValues } from 'lib/hooks/useUserChainValues'

export const WithdrawUI = () => {
  const { refetch: refetchPoolChainValues } = usePoolChainValues()
  const { refetch: refetchUsersChainValues } = useUserChainValues()
  const usersAddress = useUsersAddress()

  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [tx, setTx] = useState({
    inWallet: false,
    sent: false,
    completed: false
  })

  const refetch = () => {
    refetchPoolChainValues()
    refetchUsersChainValues()
  }

  useOnTransactionCompleted(tx, refetch)

  const txInFlight = tx.inWallet || tx.sent

  const resetState = (e) => {
    e.preventDefault()
    setWithdrawAmount('')
    setTx({
      inWallet: false,
      sent: false,
      completed: false
    })
  }

  if (!usersAddress) {
    return <ConnectWalletButton className='w-full mt-4' />
  }

  const withdrawText = `You can choose to withdraw the deposited fund at any time. By withdrawing the fund, you
  are eliminating/reducing the chance to win the prize in this pool in the next prize
  periods.`

  if (txInFlight) {
    return (
      <>
        <div className='mb-4 sm:mb-8 text-sm sm:text-base text-accent-1'>{withdrawText}</div>
        <TxMessage txType='Withdraw' tx={tx} handleReset={resetState} />
      </>
    )
  }

  return (
    <>
      <div className='mb-4 sm:mb-8 text-sm sm:text-base text-accent-1'>{withdrawText}</div>
      <WithdrawForm
        setTx={setTx}
        withdrawAmount={withdrawAmount}
        setWithdrawAmount={setWithdrawAmount}
      />
    </>
  )
}
