import React, { useContext, useState } from 'react'

import PeriodicPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PeriodicPrizePool'

import { Button } from 'lib/components/Button'
import { TxMessage } from 'lib/components/TxMessage'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { sendTx } from 'lib/utils/sendTx'

const handleCompleteAwardSubmit = async (
  setTx,
  provider,
  contractAddress,
) => {
  const params = [
    {
      gasLimit: 600000
    }
  ]

  await sendTx(
    setTx,
    provider,
    contractAddress,
    PeriodicPrizePoolAbi,
    'completeAward',
    params,
    'Complete Award',
  )
}

export const CompleteAwardUI = (props) => {
  const {
    genericChainValues
  } = props

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

    handleCompleteAwardSubmit(
      setTx,
      provider,
      props.poolAddresses.prizePool,
    )
  }

  return <>
    {!txInFlight ? <>
      {genericChainValues.canCompleteAward && <>
        <Button
          onClick={handleClick}
          color='green'
          size='sm'
        >
          Complete Award
        </Button>
      </>}
    </> : <>
      <TxMessage
        txType='Complete Award'
        tx={tx}
        handleReset={resetState}
        resetButtonText='Hide this'
      />
    </>}
    
  </>
}

