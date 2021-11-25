import React from 'react'

import { getNetworkNameAliasByChainId } from '@pooltogether/utilities'
import { BlockExplorerLink } from '../../Links/BlockExplorerLink'

export function WalletInfo (props) {
  const { t, usersAddress, chainId, disconnectWallet, walletName } = props
  const { closeModal } = props

  let networkName = null

  if (chainId) {
    networkName = <span className={'inline-block'}>{getNetworkNameAliasByChainId(chainId)}</span>
  }

  if (usersAddress && walletName) {
    return (
      <div className='flex flex-col w-full justify-between'>
        <div className='flex flex-col w-full text-xxs sm:text-lg lg:text-xl leading-snug trans'>
          <div className='text-xxs xs:text-xs uppercase font-bold text-accent-3'>
            {t?.('accountAddress') || 'Account address'}
          </div>
          <div className='flex justify-between items-center sm:text-xs lg:text-sm text-default mt-1 mb-2 sm:mb-4'>
            <BlockExplorerLink address={usersAddress} chainId={chainId} shorten />
          </div>

          <div className='my-2'>
            <div className='text-xxs xs:text-xs uppercase font-bold text-accent-3'>
              {t?.('connectedTo') || 'Connected to'}
            </div>
            <div className='flex justify-between items-center sm:text-xs lg:text-sm text-default mt-1 mb-2 sm:mb-4'>
              <div>
                {walletName}{' '}
                {chainId && chainId !== 1 && (
                  <>
                    - <span className='capitalize'>{networkName}</span>
                  </>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault()

                  closeModal()
                  disconnectWallet()
                }}
                className='inline-block text-xxs bg-body rounded-full border-2 border-accent-4 px-2 trans trans-fastest font-bold'
              >
                {t?.('disconnectWallet') || 'Disconnect wallet'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
