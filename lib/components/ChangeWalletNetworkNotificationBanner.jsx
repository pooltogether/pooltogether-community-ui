import React, { useContext, useEffect, useState } from 'react'

import { useNetwork } from 'lib/hooks/useNetwork'
import { useAddNetworkToMetamask } from 'lib/hooks/useAddNetworkToMetamask'
import { Button } from 'lib/components/Button'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { WALLETS } from 'lib/constants'
import { CloseBannerButton } from 'lib/components/NotificationBanners'

export const ChangeWalletNetworkNotificationBanner = () => {
  const wallet = useContext(WalletContext)
  const { walletConnected, walletMatchesNetwork, walletNetwork, view, chainId } = useNetwork()
  const addNetwork = useAddNetworkToMetamask(chainId)
  const [userHasClosedBanner, setUserHasClosedBanner] = useState(false)

  const { view: walletView, chainId: walletChainId } = walletNetwork

  useEffect(() => {
    setUserHasClosedBanner(false)
  }, [walletChainId])

  const walletName = wallet?.state?.wallet?.name

  const defaultNetworks = [1, 4, 42]

  if (!walletConnected || walletMatchesNetwork || userHasClosedBanner) return null

  const showConnectButton =
    [WALLETS.metamask].includes(walletName) && !defaultNetworks.includes(chainId)

  return (
    <div
      className={'text-sm sm:text-base sm:px-6 py-2 sm:py-3 text-white bg-teal z-50 flex relative'}
    >
      <div className='text-center px-4 max-w-screen-sm mx-auto flex-grow flex flex-col xs:flex-row justify-between'>
        <span>
          👋 Your wallet is currently set to <b>{walletView}</b>. Please connect to <b>{view}</b> to
          participate in this pool.
        </span>
        {showConnectButton && (
          <Button
            size='xs'
            color='primary'
            onClick={() => addNetwork()}
            paddingClasses='py-1 px-4'
            className='mt-2 mx-auto xs:mx-0 xs:mt-0 mx'
          >
            Connect to {view}
          </Button>
        )}
      </div>
      <CloseBannerButton closeBanner={() => setUserHasClosedBanner(true)} />
    </div>
  )
}
