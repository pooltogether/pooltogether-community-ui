import React, { useContext } from 'react'
import classnames from 'classnames'
import Loader from 'react-loader-spinner'
import FeatherIcon from 'feather-icons-react'

import { Button } from 'lib/components/Button'
import { InnerCard } from 'lib/components/Card'
import { EtherscanTxLink } from 'lib/components/EtherscanTxLink'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { shorten } from 'lib/utils/shorten'

export const TxMessage = (props) => {
  const walletContext = useContext(WalletContext)
  const { _onboard } = walletContext || {}
  const chainId = _onboard.getState().appNetworkId

  const { tx, txType, resetButtonText, handleReset, className } = props

  const txInWallet = tx.inWallet && !tx.sent
  const txSent = tx.sent && !tx.completed
  const txCompleted = tx.completed
  const txError = tx.error
  const txInFlight = txInWallet || txSent || txCompleted

  if (!tx || !txInFlight) {
    return null
  }

  return (
    <InnerCard className={classnames('flex flex-col text-center', className)}>
      {!txCompleted && !txError && (
        <Loader type='Oval' height={65} width={65} color='#bbb2ce' className='mx-auto mb-4' />
      )}

      {txCompleted && !txError && (
        <FeatherIcon
          icon='check-circle'
          className={'mx-auto stroke-1 w-8 sm:w-16 h-8 sm:h-16 stroke-current text-accent-1 mb-4'}
        />
      )}

      {txCompleted && txError && (
        <FeatherIcon
          icon='x-circle'
          className={'mx-auto stroke-1 w-8 sm:w-16 h-8 sm:h-16 stroke-current text-accent-1 mb-4'}
        />
      )}

      <div className='text-accent-1 text-sm sm:text-base'>Transaction status:</div>

      {txInWallet && !txError && (
        <div className='text-accent-1 text-sm sm:text-base'>
          Please confirm the transaction in your wallet ...
        </div>
      )}

      {txSent && (
        <div className='text-white text-sm sm:text-base'>Waiting for confirmations ...</div>
      )}

      {txCompleted && !txError && (
        <div className='text-green-1 text-sm sm:text-base'>Transaction successful</div>
      )}

      {txError && <div className='text-red-1 text-sm sm:text-base'>Error with transaction</div>}

      {tx.hash && (
        <div className='text-accent-1 text-sm sm:text-base'>
          Transaction hash:{' '}
          <EtherscanTxLink chainId={chainId} hash={tx.hash} className='underline'>
            {shorten(tx.hash)}
          </EtherscanTxLink>
        </div>
      )}

      {handleReset && txCompleted && (
        <Button size='sm' className='mt-4 mx-auto' color='secondary' onClick={handleReset}>
          {resetButtonText || 'Reset form'}
        </Button>
      )}
    </InnerCard>
  )
}
