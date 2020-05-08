import React, { useContext, useState } from 'react'
import { ethers } from 'ethers'

import PeriodicPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PeriodicPrizePool'

import { Button } from 'lib/components/Button'
import { WithdrawForm } from 'lib/components/WithdrawForm'
import { TxMessage } from 'lib/components/TxMessage'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { poolToast } from 'lib/utils/poolToast'
import { sendTx } from 'lib/utils/sendTx'

const handleWithdrawSubmit = async (
  setTx,
  provider,
  contractAddress,
  withdrawAmount,
  decimals
) => {
  if (
    !withdrawAmount
  ) {
    poolToast.error(`Withdraw Amount needs to be filled in`)
    return
  }

  const params = [
    ethers.utils.parseUnits(withdrawAmount, decimals),
    {
      gasLimit: 500000
    }
  ]

  await sendTx(
    setTx,
    provider,
    contractAddress,
    PeriodicPrizePoolAbi,
    'redeemTicketsInstantly',
    params,
  )

  poolToast.success('Withdraw transaction complete!')
}

export const WithdrawUI = (props) => {
  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider

  const [withdrawAmount, setWithdrawAmount] = useState('')

  const [tx, setTx] = useState({
    inWallet: false,
    sent: false,
    completed: false,
  })

  const txInFlight = tx.inWallet || tx.sent
  const txCompleted = tx.completed

  const resetState = (e) => {
    e.preventDefault()
    setWithdrawAmount('')
    setTx({})
  }

  return <>
    {!txInFlight ? <>
      <WithdrawForm
        {...props}
        handleSubmit={(e) => {
          e.preventDefault()

          handleWithdrawSubmit(
            setTx,
            provider,
            props.poolAddresses.pool,
            withdrawAmount,
            props.genericChainValues.erc20Decimals
          )
        }}
        vars={{
          withdrawAmount,
        }}
        stateSetters={{
          setWithdrawAmount,
        }}
      />
    </> : <>
      <TxMessage
        txType='Withdraw to Pool'
        tx={tx}
      />
    </>}

    {txCompleted && <>
      <div className='my-3 text-center'>
        <Button
          size='sm'
          color='black'
          onClick={resetState}
        >Reset Form</Button>
      </div>
    </>}      
    
  </>
}

