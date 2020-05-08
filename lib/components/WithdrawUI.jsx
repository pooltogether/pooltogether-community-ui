import React, { useContext, useState } from 'react'
import { ethers } from 'ethers'

import PeriodicPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PeriodicPrizePool'

import { Button } from 'lib/components/Button'
import { WithdrawForm } from 'lib/components/WithdrawForm'
import { TxMessage } from 'lib/components/TxMessage'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { poolToast } from 'lib/utils/poolToast'

const handleSubmit = async (
  setTx,
  poolAddresses,
  walletContext,
  withdrawAmount,
  genericChainValues
) => {
  if (
    !withdrawAmount
  ) {
    poolToast.error(`Withdraw Amount needs to be filled in`)
    console.error(`withdrawAmount needs to be filled in!`)
    return
  }

  setTx(tx => ({
    ...tx,
    inWallet: true
  }))


  const provider = walletContext.state.provider
  const signer = provider.getSigner()

  const poolContract = new ethers.Contract(
    poolAddresses.pool,
    PeriodicPrizePoolAbi,
    signer
  )

  try {
    const newTx = await poolContract.redeemTicketsInstantly(
      ethers.utils.parseUnits(withdrawAmount, genericChainValues.erc20Decimals),
      {
        gasLimit: 500000,
      }
    )

    setTx(tx => ({
      ...tx,
      hash: newTx.hash,
      sent: true,
    }))

    await newTx.wait()

    setTx(tx => ({
      ...tx,
      completed: true,
    }))

    poolToast.success('Withdraw transaction complete!')
  } catch (e) {
    setTx(tx => ({
      ...tx,
      hash: '',
      inWallet: true,
      sent: true,
      completed: true,
      error: true
    }))

    poolToast.error(`Error with transaction. See JS Console`)

    console.error(e.message)
  }
}


export const WithdrawUI = (props) => {
  const walletContext = useContext(WalletContext)

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

          handleSubmit(
            setTx,
            props.poolAddresses,
            walletContext,
            withdrawAmount,
            props.genericChainValues
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

