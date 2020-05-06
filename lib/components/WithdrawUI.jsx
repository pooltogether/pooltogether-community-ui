import React, { useContext, useState } from 'react'
import { ethers } from 'ethers'

import PeriodicPrizePoolAbi from 'lib/abis/PeriodicPrizePoolAbi'

import { WithdrawForm } from 'lib/components/WithdrawForm'
// import { WithdrawPanel } from 'lib/components/WithdrawPanel'
import { TxMessage } from 'lib/components/TxMessage'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { getPoolContractAddress } from 'lib/utils/getPoolContractAddress'
import { poolToast } from 'lib/utils/poolToast'

const handleSubmit = async (setTx, walletContext, withdrawAmount) => {
  const poolContractAddress = getPoolContractAddress(walletContext)

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
    poolContractAddress,
    PeriodicPrizePoolAbi,
    signer
  )

  try {
    const newTx = await poolContract.redeemTicketsInstantly(
      ethers.utils.parseEther(withdrawAmount),
      {
        gasLimit: 200000,
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

  return <>
    
    {!txInFlight ? <>
      <WithdrawForm
        handleSubmit={(e) => {
          e.preventDefault()

          handleSubmit(setTx, walletContext, withdrawAmount)
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
      
    
  </>
}

