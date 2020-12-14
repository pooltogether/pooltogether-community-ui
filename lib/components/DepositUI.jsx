import React, { useContext, useState } from 'react'
import CompoundPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/CompoundPrizePool'
import { ethers } from 'ethers'

import { DepositForm } from 'lib/components/DepositForm'
import { TxMessage } from 'lib/components/TxMessage'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { poolToast } from 'lib/utils/poolToast'
import { sendTx } from 'lib/utils/sendTx'
import { useAtom } from 'jotai'
import { poolAddressesAtom } from 'lib/hooks/usePoolAddresses'
import { poolChainValuesAtom } from 'lib/hooks/usePoolChainValues'

const handleDepositSubmit = async (
  setTx,
  provider,
  usersAddress,
  contractAddress,
  ticketAddress,
  depositAmount,
  decimals
) => {
  if (!depositAmount) {
    poolToast.error(`Deposit Amount needs to be filled in`)
    return
  }

  const referrer = ethers.constants.AddressZero // TODO
  const params = [
    usersAddress,
    ethers.utils.parseUnits(depositAmount, decimals),
    ticketAddress,
    referrer,
    {
      gasLimit: 800000
    }
  ]

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
  const usersAddress = walletContext._onboard.getState().address

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

  const resetState = (e) => {
    e.preventDefault()
    setDepositAmount('')
    setTx({
      inWallet: false,
      sent: false,
      completed: false
    })
  }

  if (txInFlight) {
    return <TxMessage txType='Deposit' tx={tx} handleReset={resetState} />
  }

  return (
    <>
      <div className='mb-4 sm:mb-8 text-sm sm:text-base text-accent-1'>{depositMessage}</div>
      <DepositForm
        {...props}
        handleSubmit={(e) => {
          e.preventDefault()
          handleDepositSubmit(
            setTx,
            provider,
            usersAddress,
            poolAddresses.prizePool,
            ticketAddress,
            depositAmount,
            poolChainValues.tokenDecimals
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
