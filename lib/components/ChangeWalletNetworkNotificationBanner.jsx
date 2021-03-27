import React, { useContext, useEffect, useState } from 'react'

import { useNetwork } from 'lib/hooks/useNetwork'
import { useAddNetworkToMetamask } from 'lib/hooks/useAddNetworkToMetamask'
import { Button } from 'lib/components/Button'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { WALLETS } from 'lib/constants'
import { NotificationBanner } from 'lib/components/NotificationBanners'

export const ChangeWalletNetworkNotificationBanner = (props) => {
  const { walletConnected, walletMatchesNetwork, walletNetwork, view, chainId } = useNetwork()

  if (!walletConnected || walletMatchesNetwork) return null

  return (
    <NotificationBanner className='bg-teal'>
      <ChangeWalletNetworkNotification
        chainId={chainId}
        walletNetwork={walletNetwork}
        poolChainName={view}
      />
    </NotificationBanner>
  )
}

const ChangeWalletNetworkNotification = (props) => {
  const { chainId, walletNetwork, poolChainName } = props

  const wallet = useContext(WalletContext)
  const addNetwork = useAddNetworkToMetamask(chainId)

  const walletName = wallet?.state?.wallet?.name
  const { view: walletChainName } = walletNetwork
  const walletIsMetaMask = [WALLETS.metamask].includes(walletName)

  const defaultNetworks = [1, 4, 42]
  const isSupportedEthereumNetwork = defaultNetworks.includes(chainId)

  const showConnectButton = walletIsMetaMask && !isSupportedEthereumNetwork
  const showBadWalletMessage = !walletIsMetaMask && !isSupportedEthereumNetwork

  return (
    <div className='flex flex-col sm:flex-row justify-between items-center'>
      <span>
        👋 Your wallet is currently set to <b>{walletChainName}</b>. Please connect to{' '}
        <b>{poolChainName}</b> to participate in this pool.
        <br className='hidden xs:block' />
        {showBadWalletMessage && (
          <span>
            {' '}
            ⚠️ You will need to use{' '}
            <a href='https://metamask.io' className='underline hover:opacity-80'>
              <b>MetaMask</b>
            </a>{' '}
            to connect to this network.
          </span>
        )}
      </span>

      {showConnectButton && (
        <Button
          size='xs'
          color='primary'
          onClick={() => addNetwork()}
          paddingClasses='py-1 px-4'
          className='mt-2 mx-auto sm:mx-0 sm:mt-0 mx'
        >
          Connect to {poolChainName}
        </Button>
      )}
    </div>
  )
}
