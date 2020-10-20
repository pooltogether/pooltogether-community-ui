import React, { useContext, useState } from 'react'

import SingleRandomWinnerAbi from '@pooltogether/pooltogether-contracts/abis/SingleRandomWinner'

import { Button } from 'lib/components/Button'
import { TxMessage } from 'lib/components/TxMessage'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { sendTx } from 'lib/utils/sendTx'

const handleStartAwardSubmit = async (
  setTx,
  provider,
  contractAddress,
) => {
  const params = [
    {
      gasLimit: 300000
    }
  ]

  await sendTx(
    setTx,
    provider,
    contractAddress,
    SingleRandomWinnerAbi,
    'startAward',
    params,
    'Start Award',
  )
}

export const StartAwardUI = (props) => {
  const {
    genericChainValues
  } = props

  const {
    canCompleteAward,
    canStartAward,
    isRngRequested,
  } = genericChainValues

  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider

  const [tx, setTx] = useState({})

  const txInFlight = tx.inWallet || tx.sent && !tx.completed

  const resetState = (e) => {
    e.preventDefault()
    setTx({})
  }

  const handleClick = (e) => {
    e.preventDefault()

    handleStartAwardSubmit(
      setTx,
      provider,
      props.poolAddresses.prizeStrategy,
    )
  }

  return <>
    {!canStartAward && !isRngRequested && !canCompleteAward && <>
      <div className='my-4'>
        <span className='text-default'>Pool status:</span> <div className='font-bold'>Open for deposits ...</div>
      </div>
    </>}

    {!txInFlight ? <>
      {canStartAward && <>
        <Button
          onClick={handleClick}
          color='blue'
          size='sm'
        >
          Start award
        </Button>
      </>}
    </> : <>
      <TxMessage
        txType='Start Award'
        tx={tx}
        handleReset={resetState}
        resetButtonText='Hide this'
      />
    </>}

  </>
}
