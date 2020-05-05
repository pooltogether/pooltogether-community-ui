import React from 'react'

import { EtherscanTxLink } from 'lib/components/EtherscanTxLink'
import { LoadingDots } from 'lib/components/LoadingDots'
import { shortenAddress } from 'lib/utils/shortenAddress'

export const TxMessage = (props) => {
  const {
    tx,
    txType,
  } = props

  const txInWallet = tx.inWallet && !tx.sent
  const txSent = tx.sent && !tx.completed
  const txCompleted = tx.completed
  const txError = tx.error
  const txInFlight = (txInWallet || txSent || txCompleted)

  if (!tx) {
    return null
  }

  console.log({ txInWallet})
  console.log({ txSent})
  console.log({ txCompleted})
  console.log({ txError})
  console.log({ txInFlight})

  return <>
    {txInFlight && <>
      <div
        className='pt-10 sm:pt-3 pb-3 px-2 sm:px-20 lg:px-20 text-center text-white text-xs sm:text-sm lg:text-base'
      >
        <div
          className='font-bold rounded-full mb-4 text-white text-sm sm:text-lg uppercase px-2 py-1 bg-purple-900'
        >
          Transaction status
        </div>

        <div
          className='mb-4 text-white text-base sm:text-xl lg:text-2xl'
        >
          {txType}
        </div>

        {txInWallet && <>
          <div
            className='mb-2 text-orange-400 text-base sm:text-lg lg:text-xl'
          >
            Please confirm the transaction in your wallet ...
          </div>
        </>}

        {txSent && <>
          <div
            className='mb-2 text-orange-400 text-base sm:text-lg lg:text-xl'
          >
            Waiting for confirmations ...
          </div>

          <div className='my-3'>
            <LoadingDots />
          </div>
        </>}

        {txCompleted && <>
          <div
            className='mb-2 text-green-300 text-base sm:text-lg lg:text-xl'
          >
            Transaction successful!
          </div>

          <div className='my-3'>
            Waiting on events ...
          </div>
        </>}

        {txError && <>
          <div
            className='mb-2 text-red-500 text-base sm:text-lg lg:text-xl'
          >
            There was an error with the transaction
          </div>

          <div className='my-3'>
            Click the link below to see the result on Etherscan or check the JS console.
          </div>
        </>}



        <div
          className='mt-6 font-bold uppercase text-lightPurple-600 text-xs sm:text-sm lg:text-base'
        >
          {tx.hash && <>
            Tx Hash
          </>}
        </div>

        <div
          className='uppercase text-lightPurple-600 text-sm sm:text-base'
        >
          {tx.hash && <>
            {<EtherscanTxLink
              chainId={42}
              hash={tx.hash}
            >
              {shortenAddress(tx.hash)}
            </EtherscanTxLink>}
          </>}
        </div>




      </div>
    </>}

  </>

}