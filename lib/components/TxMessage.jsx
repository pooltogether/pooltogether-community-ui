import { Button } from 'lib/components/Button'
import { EtherscanTxLink } from 'lib/components/EtherscanTxLink'
import { LoadingDots } from 'lib/components/LoadingDots'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { shorten } from 'lib/utils/shorten'
import React, { useContext } from 'react'

export const TxMessage = (props) => {
  const walletContext = useContext(WalletContext)
  const { _onboard } = walletContext || {}
  const chainId = _onboard.getState().appNetworkId

  const { tx, txType, resetButtonText, handleReset } = props

  const txInWallet = tx.inWallet && !tx.sent
  const txSent = tx.sent && !tx.completed
  const txCompleted = tx.completed
  const txError = tx.error
  const txInFlight = txInWallet || txSent || txCompleted

  if (!tx) {
    return null
  }

  return (
    <>
      {txInFlight && (
        <>
          <div className='bg-card rounded-lg px-2 sm:px-4 pt-5 pb-2 sm:py-6 text-center text-white text-xs sm:text-sm lg:text-base'>
            <div className='font-bold text-default-soft text-sm sm:text-base uppercase px-2 pb-2'>
              Transaction status
            </div>

            <div className='mb-4 text-white text-lg sm:text-xl lg:text-2xl'>{txType}</div>

            {txInWallet && (
              <>
                <div className='mb-1 text-yellow-1 text-base sm:text-lg lg:text-xl'>
                  Please confirm the transaction in your wallet ...
                </div>
              </>
            )}

            {txSent && (
              <>
                <div className='mt-6'>
                  <LoadingDots />
                </div>
                <div className='mb-1 text-yellow-1 text-base sm:text-lg lg:text-xl'>
                  Waiting for confirmations ...
                </div>
              </>
            )}

            {txCompleted && !txError && (
              <>
                <div className='mb-1 text-green-1 text-base sm:text-lg lg:text-xl'>
                  Transaction successful!
                </div>
              </>
            )}

            {txError && (
              <>
                <div className='mb-1 text-red-500 text-base sm:text-lg lg:text-xl'>
                  There was an error with the transaction
                </div>

                <div className='my-2 text-highlight-2'>
                  {tx && tx.hash ? (
                    <>
                      {
                        <EtherscanTxLink chainId={chainId} hash={tx.hash}>
                          See the result on Etherscan
                        </EtherscanTxLink>
                      }{' '}
                      or check the JS console.
                    </>
                  ) : (
                    <>Transaction Failed</>
                  )}
                </div>
              </>
            )}

            <div className='mt-6 font-bold uppercase text-default-soft text-xs sm:text-sm lg:text-base'>
              {tx.hash && <>Tx Hash</>}
            </div>

            <div className='uppercase text-lightPurple-600 text-sm sm:text-base opacity-70 hover:opacity-70'>
              {tx.hash && (
                <>
                  {
                    <EtherscanTxLink chainId={chainId} hash={tx.hash}>
                      {shorten(tx.hash)}
                    </EtherscanTxLink>
                  }
                </>
              )}
            </div>

            {handleReset && txCompleted && (
              <>
                <div className='mt-6 mb-2 text-center'>
                  <Button size='sm' className='mx-auto' color='secondary' onClick={handleReset}>
                    {resetButtonText || 'Reset form'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  )
}
