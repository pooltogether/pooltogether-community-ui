import React, { useContext, useState } from 'react'

import PeriodicPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PeriodicPrizePool'

import { Button } from 'lib/components/Button'
import { SweepTimelockedForm } from 'lib/components/SweepTimelockedForm'
import { TxMessage } from 'lib/components/TxMessage'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { poolToast } from 'lib/utils/poolToast'
import { sendTx } from 'lib/utils/sendTx'

const handleSweepTimelockedSubmit = async (
  setTx,
  provider,
  contractAddress,
  usersAddress,
) => {
  const params = [
    [usersAddress],
    {
      gasLimit: 500000
    }
  ]
  await sendTx(
    setTx,
    provider,
    contractAddress,
    PeriodicPrizePoolAbi,
    'sweepTimelockFunds',
    params,
  )

  poolToast.success('Sweep timelocked funds transaction complete!')
}

export const SweepTimelockedUI = (props) => {
  const {
    usersChainValues,
  } = props

  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider
  const usersAddress = walletContext._onboard.getState().address

  const [tx, setTx] = useState({
    inWallet: false,
    sent: false,
    completed: false,
  })

  const {
    usersTimelockBalance
  } = usersChainValues || {}
  const userHasTimelockedFunds = usersTimelockBalance && usersTimelockBalance.gt(0)

  const txInFlight = tx.inWallet || tx.sent
  const txCompleted = tx.completed

  const resetState = (e) => {
    e.preventDefault()
    setTx({})
  }

  return <>
    {!txInFlight ? <>
      <SweepTimelockedForm
        {...props}
        disabled={!userHasTimelockedFunds}
        usersTimelockBalance={usersTimelockBalance}
        handleSubmit={(e) => {
          e.preventDefault()

          handleSweepTimelockedSubmit(
            setTx,
            provider,
            props.poolAddresses.pool,
            usersAddress,
          )
        }}
      />
    </> : <>
      <TxMessage
        txType='Sweep Timelocked Funds'
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

