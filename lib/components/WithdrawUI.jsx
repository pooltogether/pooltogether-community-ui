import React, { useContext, useEffect, useState } from 'react'
import { useAtom } from 'jotai'

import { TxMessage } from 'lib/components/TxMessage'
import { WithdrawForm } from 'lib/components/WithdrawForm'
import { usersAddressAtom } from 'lib/hooks/useUsersAddress'
import { ConnectWalletButton } from 'lib/components/ConnectWalletButton'
import { fetchPoolChainValues, poolChainValuesAtom } from 'lib/hooks/usePoolChainValues'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { poolAddressesAtom } from 'lib/hooks/usePoolAddresses'
import { contractVersionsAtom, prizePoolTypeAtom } from 'lib/hooks/useDetermineContractVersions'
import { errorStateAtom } from 'lib/components/PoolData'
import { useNetwork } from 'lib/hooks/useNetwork'

export const WithdrawUI = (props) => {
  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider
  const [usersAddress] = useAtom(usersAddressAtom)
  const [poolAddresses] = useAtom(poolAddressesAtom)
  const [prizePoolType] = useAtom(prizePoolTypeAtom)
  const [errorState, setErrorState] = useAtom(errorStateAtom)
  const [contractVersions] = useAtom(contractVersionsAtom)
  const [poolChainValues, setPoolChainValues] = useAtom(poolChainValuesAtom)
  const [chainId] = useNetwork()

  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [tx, setTx] = useState({
    inWallet: false,
    sent: false,
    completed: false
  })

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

  useEffect(() => {
    if (tx.completed) {
      fetchPoolChainValues(
        provider,
        chainId,
        poolAddresses,
        prizePoolType,
        setPoolChainValues,
        contractVersions.prizeStrategy.contract,
        setErrorState
      )
    }
  }, [tx.completed])

  if (!usersAddress) {
    return <ConnectWalletButton />
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
