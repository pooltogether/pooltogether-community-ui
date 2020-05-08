import React, { useContext, useState } from 'react'
import { ethers } from 'ethers'

import PeriodicPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PeriodicPrizePool'

import { Button } from 'lib/components/Button'
import { TxMessage } from 'lib/components/TxMessage'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { poolToast } from 'lib/utils/poolToast'

const handleCompleteAward = async (setTx, poolAddresses, walletContext) => {
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
    const newTx = await poolContract.completeAward()

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

    poolToast.success('Complete award tx complete!')
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


export const CompleteAwardUI = (props) => {
  const {
    genericChainValues
  } = props

  const walletContext = useContext(WalletContext)

  const [tx, setTx] = useState({})

  const txInFlight = tx.inWallet || tx.sent && !tx.completed

  const resetState = (e) => {
    e.preventDefault()
    setTx({})
  }

  return <>
    {!txInFlight ? <>
      {genericChainValues.canAward && <>
        <Button
          onClick={(e) => {
            e.preventDefault()
            handleCompleteAward(setTx, props.poolAddresses, walletContext)
          }}
          color='green'
          size='sm'
          paddingClasses='px-2 py-3'
        >
          Complete Award
        </Button>
      </>}
    </> : <>
      <TxMessage
        txType='Complete Award'
        tx={tx}
      />
    </>}
    
  </>
}

