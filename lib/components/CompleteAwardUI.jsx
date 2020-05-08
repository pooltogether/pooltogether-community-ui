import React, { useContext, useState } from 'react'

import PeriodicPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PeriodicPrizePool'

import { Button } from 'lib/components/Button'
import { TxMessage } from 'lib/components/TxMessage'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { sendTx } from 'lib/utils/sendTx'

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
  

  const handleAwardClick = (e) => {
    e.preventDefault()
    sendTx(
      setTx,
      provider,
      props.poolAddresses.pool,
      PeriodicPrizePoolAbi,
      'completeAward'
    )
    // handleCompleteAward(setTx, props.poolAddresses, walletContext)
  }

  return <>
    {!txInFlight ? <>
      {genericChainValues.canAward && <>
        <Button
          onClick={handleAwardClick}
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

