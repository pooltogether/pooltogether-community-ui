import React, { useContext, useState } from 'react'

import TimelockAbi from '@pooltogether/pooltogether-contracts/abis/Timelock'

import { SweepTimelockedForm } from 'lib/components/SweepTimelockedForm'
import { TxMessage } from 'lib/components/TxMessage'
import { WalletContext } from 'lib/components/WalletContextProvider'
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
    TimelockAbi,
    'sweep',
    params,
    'Sweep Timelocked Funds'
  )
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
            props.poolAddresses.timelock,
            usersAddress,
          )
        }}
      />
    </> : <>
      <TxMessage
        txType='Sweep Timelocked Funds'
        tx={tx}
        handleReset={resetState}
      />
    </>}
    
  </>
}

