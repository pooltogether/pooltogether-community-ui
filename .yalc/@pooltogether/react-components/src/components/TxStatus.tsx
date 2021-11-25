import React, { useEffect, useState } from 'react'
import FeatherIcon from 'feather-icons-react'
import Loader from 'react-loader-spinner'

import { Banner } from './Containers/Banner'
import { BlockExplorerLink } from './Links/BlockExplorerLink'

export const TxStatus = (props) => {
  const { chainId, t, tx, title, subtitle } = props
  const { hideOnInWallet, hideOnSent, hideOnSuccess, hideOnError } = props
  const { inWalletMessage, sentMessage, successMessage, errorMessage } = props
  const [showExtraMessage, setShowExtraMessage] = useState(false)

  const txCancelled = tx?.cancelled
  const txInWallet = tx?.inWallet && !tx?.sent
  const txSent = tx?.sent && !tx?.completed
  const txCompleted = tx?.completed
  const txError = Boolean(tx?.error)

  const transactionStatusText = t ? t('transactionStatus') : 'Transaction status'
  const pleaseConfirmInWalletText = t
    ? t('pleaseConfirmInYourWallet')
    : 'Please confirm in your wallet'
  const transactionSentConfirmingText = t
    ? t('transactionSentConfirming')
    : 'Transaction confirming ...'
  const transactionSuccessfulText = t ? t('transactionSuccessful') : 'Transaction successful!'
  const transactionFailedText = t ? t('transactionFailed') : 'Transaction failed'
  const transactionHashText = t ? t('transactionHash') : 'Transaction hash:'
  const transactionsMayTakeAFewMinutesText = t
    ? t('transactionsMayTakeAFewMinutes')
    : 'Transactions may take a few minutes.'

  useEffect(() => {
    let key
    if (txSent) {
      key = setTimeout(() => setShowExtraMessage(true), 15000)
    }
    return () => {
      key && clearTimeout(key)
    }
  }, [txSent])

  if (!tx) return null
  if (txCancelled) return null
  if (hideOnInWallet && txInWallet) return null
  if (hideOnSent && txSent) return null
  if (hideOnSuccess && txCompleted) return null
  if (hideOnError && txError) return null

  return (
    <>
      {title && <h3 className='text-inverse mb-4'>{title}</h3>}

      {subtitle && <h6 className='text-accent-1 mb-4'>{subtitle}</h6>}

      <Banner className='flex flex-col'>
        {txSent && !txCompleted && !txError && (
          <Loader type='Oval' height={50} width={50} color='#bbb2ce' />
        )}

        {txCompleted && !txError && (
          <FeatherIcon
            icon='check-circle'
            className={'mx-auto stroke-1 w-16 h-16 stroke-current text-green mb-4'}
          />
        )}

        {txCompleted && txError && (
          <FeatherIcon
            icon='x-circle'
            className={'mx-auto stroke-1 w-16 h-16 stroke-current text-red mb-4'}
          />
        )}

        <div className='text-accent-1 opacity-80 text-sm sm:text-base'>{transactionStatusText}</div>

        {txInWallet && !txError && (
          <div className='text-sm sm:text-base text-inverse'>
            {inWalletMessage ? inWalletMessage : pleaseConfirmInWalletText}
          </div>
        )}

        {txSent && (
          <div className='text-sm sm:text-base text-inverse'>
            {sentMessage ? sentMessage : transactionSentConfirmingText}
          </div>
        )}

        {txCompleted && !txError && (
          <div className='text-green text-sm sm:text-base'>
            {successMessage ? successMessage : transactionSuccessfulText}
          </div>
        )}

        {txError && (
          <div className='text-red text-sm sm:text-base'>
            {errorMessage ? errorMessage : transactionFailedText}
          </div>
        )}

        {tx.hash && (
          <div className='text-xxs sm:text-sm text-accent-1 opacity-80 mt-2'>
            {transactionHashText}
            <BlockExplorerLink
              chainId={chainId}
              txHash={tx.hash}
              className='underline text-accent-1 opacity-80'
              shorten
            />
          </div>
        )}

        {showExtraMessage && (
          <div className='text-xxs sm:text-sm text-accent-4 mt-2'>
            {transactionsMayTakeAFewMinutesText}
          </div>
        )}
      </Banner>
    </>
  )
}

TxStatus.defaultProps = {
  hideOnError: false,
  hideOnSuccess: false,
  hideOnInWallet: false,
  hideOnSent: false,
  hideExtraMessage: false
}
