import React from 'react'
import FeatherIcon from 'feather-icons-react'

import { ThemedClipSpinner } from '../../Loading/ThemedClipSpinner'
import { Tooltip } from '../../Containers/Tooltip'
import { BlockExplorerLink } from '../../Links/BlockExplorerLink'

export function TransactionsListItem (props) {
  const { tx, t } = props

  const errorIcon = (
    <FeatherIcon icon='help-circle' className='list-item--icon relative w-5 h-5 text-red' />
  )

  return (
    <li key={tx.hash || Date.now()} className='list-item rounded-lg relative p-2 -mx-2'>
      <div className='flex justify-between w-full'>
        <div className='pr-2'>
          {tx.hash ? (
            <BlockExplorerLink chainId={tx.ethersTx.chainId} txHash={tx.hash}>
              {tx.name}
            </BlockExplorerLink>
          ) : (
            tx.name
          )}
        </div>

        <div className='w-5'>
          {!tx.completed && (
            <div
              className='-l-1 -t-2'
              style={{
                transform: 'scale(0.9)'
              }}
            >
              <ThemedClipSpinner />
            </div>
          )}

          {tx.completed && !tx.error && (
            <BlockExplorerLink noIcon chainId={tx.ethersTx.chainId} txHash={tx.hash}>
              <FeatherIcon
                icon='check-circle'
                className='list-item--icon relative w-5 h-5 text-green'
              />
            </BlockExplorerLink>
          )}

          {tx.reason && (
            <Tooltip id='tx-error' tip={tx.reason}>
              {errorIcon}
            </Tooltip>
          )}

          {tx.error && !tx.reason && (
            <BlockExplorerLink noIcon chainId={tx.ethersTx.chainId} txHash={tx.hash}>
              {errorIcon}
            </BlockExplorerLink>
          )}
        </div>
      </div>

      {tx.inWallet && (
        <span className='text-orange'>
          {tx.inWallet && (
            <>{t?.('pleaseConfirmInYourWallet') || 'Please confirm in your wallet'}</>
          )}
        </span>
      )}
    </li>
  )
}
