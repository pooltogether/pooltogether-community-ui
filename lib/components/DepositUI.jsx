import React, { useContext, useState } from 'react'
import CompoundPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/CompoundPrizePool'
import { ethers } from 'ethers'
import { useAtom } from 'jotai'

import { ConnectWalletButton } from 'lib/components/ConnectWalletButton'
import { DepositForm } from 'lib/components/DepositForm'
import { TxMessage } from 'lib/components/TxMessage'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { poolAddressesAtom } from 'lib/hooks/usePoolAddresses'
import { poolChainValuesAtom } from 'lib/hooks/usePoolChainValues'
import { usersAddressAtom } from 'lib/hooks/useUsersAddress'
import { parseNumString } from 'lib/utils/parseNumString'
import { sendTx } from 'lib/utils/sendTx'

const handleDepositSubmit = async (
  setTx,
  provider,
  usersAddress,
  contractAddress,
  ticketAddress,
  depositAmountBN
) => {
  const referrer = ethers.constants.AddressZero // TODO

  const params = [usersAddress, depositAmountBN, ticketAddress, referrer]

  await sendTx(
    setTx,
    provider,
    contractAddress,
    CompoundPrizePoolAbi,
    'depositTo',
    params,
    'Deposit'
  )
}

export const DepositUI = (props) => {
  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider
  const [usersAddress] = useAtom(usersAddressAtom)
  const [poolAddresses] = useAtom(poolAddressesAtom)
  const [poolChainValues] = useAtom(poolChainValuesAtom)

  const ticketAddress = poolAddresses.ticket
  const tokenSymbol = poolChainValues.tokenSymbol || 'TOKEN'
  const ticketSymbol = poolChainValues.ticketSymbol || 'TOKEN'
  const depositMessage = `You can deposit ${tokenSymbol} to be eligible to win the prizes in this pool. Once deposited you will receive ${ticketSymbol} and be entered to win until your ${tokenSymbol} is withdrawn.`

  const [depositAmount, setDepositAmount] = useState('')

  const [tx, setTx] = useState({
    inWallet: false,
    sent: false,
    completed: false
  })

  const txInFlight = tx.inWallet || tx.sent

  const decimals = poolChainValues.tokenDecimals
  const depositAmountBN = parseNumString(depositAmount, decimals)
  const inputError = !depositAmountBN

  const resetState = (e) => {
    e.preventDefault()
    setDepositAmount('')
    setTx({
      inWallet: false,
      sent: false,
      completed: false
    })
  }

  if (!usersAddress) {
    return <ConnectWalletButton className='w-full mt-4' />
  }

  if (txInFlight) {
    return (
      <>
        <div className='mb-4 sm:mb-8 text-sm sm:text-base text-accent-1'>{depositMessage}</div>
        <TxMessage
          txType='Deposit'
          tx={tx}
          handleReset={resetState}
          resetButtonText='Deposit more'
        />
      </>
    )
  }

  return (
    <>
      <div className='mb-4 sm:mb-8 text-sm sm:text-base text-accent-1'>{depositMessage}</div>
      <DepositForm
        inputError={inputError}
        handleSubmit={(e) => {
          e.preventDefault()
          handleDepositSubmit(
            setTx,
            provider,
            usersAddress,
            poolAddresses.prizePool,
            ticketAddress,
            depositAmountBN
          )
        }}
        vars={{
          depositAmount
        }}
        stateSetters={{
          setDepositAmount
        }}
      />
    </>
  )
}
