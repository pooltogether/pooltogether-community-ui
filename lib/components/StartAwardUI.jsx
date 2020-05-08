import React, { useContext, useState } from 'react'

import PeriodicPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PeriodicPrizePool'

import { Button } from 'lib/components/Button'
import { TxMessage } from 'lib/components/TxMessage'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { poolToast } from 'lib/utils/poolToast'
import { sendTx } from 'lib/utils/sendTx'

const handleStartAwardSubmit = async (
  setTx,
  provider,
  contractAddress,
) => {
  const params = [
    {
      gasLimit: 200000
    }
  ]

  try {
    await sendTx(
      setTx,
      provider,
      contractAddress,
      PeriodicPrizePoolAbi,
      'startAward',
      params,
    )

    poolToast.success('Start award transaction complete!')
  } catch (e) {
    // poolToast.error('err!')
  }
}

export const StartAwardUI = (props) => {
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

    handleStartAwardSubmit(
      setTx,
      provider,
      props.poolAddresses.pool,
    )
  }

  return <>
    {!txInFlight ? <>
      {genericChainValues.canStartAward && <>
        <Button
          onClick={handleClick}
          color='green'
          size='sm'
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

