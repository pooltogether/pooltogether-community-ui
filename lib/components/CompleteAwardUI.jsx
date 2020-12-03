import React, { useContext, useState } from 'react'
import SingleRandomWinnerAbi from '@pooltogether/pooltogether-contracts/abis/SingleRandomWinner'

import { Button } from 'lib/components/Button'
import { TxMessage } from 'lib/components/TxMessage'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { sendTx } from 'lib/utils/sendTx'

const handleCompleteAwardSubmit = async (setTx, provider, contractAddress) => {
  const params = [
    {
      gasLimit: 700000
    }
  ]

  await sendTx(
    setTx,
    provider,
    contractAddress,
    SingleRandomWinnerAbi,
    'completeAward',
    params,
    'Complete Award'
  )
}

export const CompleteAwardUI = (props) => {
  const { poolChainValues } = props

  const { isRngRequested, canCompleteAward } = poolChainValues

  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider

  const [tx, setTx] = useState({})

  const txInFlight = tx.inWallet || (tx.sent && !tx.completed)

  const resetState = (e) => {
    e.preventDefault()
    setTx({})
  }

  const handleClick = (e) => {
    e.preventDefault()

    handleCompleteAwardSubmit(setTx, provider, props.poolAddresses.prizeStrategy)
  }

  return (
    <>
      {isRngRequested && !canCompleteAward && (
        <div className='my-4'>
          <span className='text-default'>Pool status:</span>{' '}
          <div className='font-bold'>Random number being calculated! Please wait ...</div>
        </div>
      )}

      {!txInFlight ? (
        <>
          {canCompleteAward && (
            <Button onClick={handleClick} color='orange' size='sm'>
              Complete Award
            </Button>
          )}
        </>
      ) : (
        <TxMessage
          txType='Complete Award'
          tx={tx}
          handleReset={resetState}
          resetButtonText='Hide this'
        />
      )}
    </>
  )
}
