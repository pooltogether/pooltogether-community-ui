import React, { useContext, useState } from 'react'

import CompoundPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/CompoundPrizePool'

import { SweepTimelockedForm } from 'lib/components/SweepTimelockedForm'
import { TxMessage } from 'lib/components/TxMessage'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { sendTx } from 'lib/utils/sendTx'

const handleSweepTimelockedSubmit = async (setTx, provider, contractAddress, usersAddress) => {
  const params = [
    [usersAddress],
    {
      gasLimit: 700000,
    },
  ]

  await sendTx(
    setTx,
    provider,
    contractAddress,
    CompoundPrizePoolAbi,
    'sweepTimelockBalances',
    params,
    'Sweep Timelocked Funds'
  )
}

export const SweepTimelockedUI = (props) => {
  const { usersChainValues } = props

  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider
  const usersAddress = walletContext._onboard.getState().address

  const [tx, setTx] = useState({
    inWallet: false,
    sent: false,
    completed: false,
  })

  const { usersTimelockBalance, usersTimelockBalanceAvailableAt } = usersChainValues || {}

  const userHasTimelockedFunds = usersTimelockBalance && usersTimelockBalance.gt(0)
  const txInFlight = tx.inWallet || tx.sent

  const resetState = (e) => {
    e.preventDefault()
    setTx({})
  }

  return (
    <>
      {!txInFlight ? (
        <>
          <SweepTimelockedForm
            {...props}
            hasFundsToSweep={!userHasTimelockedFunds}
            usersTimelockBalance={usersTimelockBalance}
            usersTimelockBalanceAvailableAt={parseInt(usersTimelockBalanceAvailableAt, 10)}
            handleSubmit={(e) => {
              e.preventDefault()

              handleSweepTimelockedSubmit(
                setTx,
                provider,
                props.poolAddresses.prizePool,
                usersAddress
              )
            }}
          />
        </>
      ) : (
        <>
          <TxMessage txType='Sweep Timelocked Funds' tx={tx} handleReset={resetState} />
        </>
      )}
    </>
  )
}
