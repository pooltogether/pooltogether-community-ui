import React from 'react'
import { useRouter } from 'next/router'

import { ETHEREUM_NETWORKS, WALLETS } from 'lib/constants'
import { useAddNetworkToMetamask } from 'lib/hooks/useAddNetworkToMetamask'
import { useNetwork } from 'lib/hooks/useNetwork'
import { useWalletNetwork } from 'lib/hooks/useWalletNetwork'
import { Button } from 'lib/components/Button'
import { NotificationBanner } from 'lib/components/NotificationBanners'
import { NETWORK } from 'lib/utils/networks'

export const ChangeWalletNetworkNotificationBanner = (props) => {
  const { walletConnected } = useWalletNetwork()
  const { walletMatchesNetwork } = useNetwork()

  if (!walletConnected || walletMatchesNetwork) return null

  return (
    <NotificationBanner className='bg-teal' canClose>
      <ChangeWalletNetworkNotification />
    </NotificationBanner>
  )
}

// TODO: Blocked on a guide for network changing
const ChangeWalletNetworkNotification = (props) => {
  const { name: poolChainName, chainId: poolChainId } = useNetwork()
  const { walletName, walletNetworkShortName } = useWalletNetwork()

  const addNetwork = useAddNetworkToMetamask(poolChainId)
  const walletIsMetaMask = [WALLETS.metamask].includes(walletName)

  const isSupportedEthereumNetwork = ETHEREUM_NETWORKS.includes(poolChainId)

  const connectableNetwork = [
    NETWORK.matic,
    NETWORK.mumbai,
    NETWORK.xdai,
    NETWORK.bsc,
    NETWORK['bsc-testnet'],
    NETWORK.poa,
    NETWORK['poa-sokol']
  ]
  const isConnectableNetwork = connectableNetwork.includes(poolChainId)

  const showConnectButton = walletIsMetaMask && isConnectableNetwork
  const showBadWalletMessage = !walletIsMetaMask && !isSupportedEthereumNetwork

  const router = useRouter()
  const isPool = Boolean(router?.query?.poolAlias || router?.query?.prizePoolAddress)
  const words = isPool ? 'this pool' : 'these pools'

  return (
    <div className='flex flex-col sm:flex-row justify-between items-center'>
      <span>
        👋 Your wallet is currently set to <b>{walletNetworkShortName}</b>. Please connect to{' '}
        <b>{poolChainName}</b> to participate in {words}.
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
      {showConnectButton ? (
        <Button
          size='xs'
          color='primary'
          onClick={() => addNetwork()}
          paddingClasses='py-1 px-4'
          className='mt-2 mx-auto sm:mr-0 sm:ml-2 sm:mt-0'
        >
          Connect to {poolChainName}
        </Button>
      ) : null}
    </div>
  )
}

// TODO: Render this in the false case once we have a link to an article
// (
//   <ButtonLink
//     size='xs'
//     color='primary'
//     paddingClasses='py-1 px-4'
//     className='mt-2 mx-auto sm:mx-0 sm:mt-0 mx'
//     href='https://www.google.com'
//     target='_blank'
//     rel='noopener noreferrer'
//   >
//     More info
//   </ButtonLink>
// )
