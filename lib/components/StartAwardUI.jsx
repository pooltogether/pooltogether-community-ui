import React, { useContext, useState } from 'react'
import classnames from 'classnames'
import { ethers } from 'ethers'

import PeriodicPrizePoolAbi from 'lib/abis/PeriodicPrizePoolAbi'

import { Button } from 'lib/components/Button'
import { TxMessage } from 'lib/components/TxMessage'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { poolToast } from 'lib/utils/poolToast'

const handleStartAward = async (setTx, poolAddresses, walletContext) => {
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
    const newTx = await poolContract.startAward()

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

    poolToast.success('Start award tx complete!')
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


export const StartAwardUI = (props) => {
  const {
    chainValues
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
      {chainValues.canAward && <>
        <Button
          onClick={(e) => {
            e.preventDefault()
            handleStartAward(setTx, props.poolAddresses, walletContext)
          }}
          color='green'
          size='sm'
          paddingClasses='px-2 py-3'
        >
          Start Award
        </Button>
      </>}
    </> : <>
      <TxMessage
        txType='Start Award'
        tx={tx}
      />
    </>}
    
  </>
}

