import React, { useContext } from 'react'
import classnames from 'classnames'

import { SUPPORTED_NETWORKS } from 'lib/constants'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { chainIdToName } from 'lib/utils/chainIdToName'

export const StaticNetworkNotificationBanner = ({
}) => {
  let chainId
  const walletContext = useContext(WalletContext)
  const { _onboard } = walletContext || {}

  if (!_onboard.getState().wallet.name) {
    return null
  }

  chainId = _onboard.getState().appNetworkId
  const networkName = chainIdToName(chainId)

  const networkSupported = SUPPORTED_NETWORKS.includes(chainId)

  let networkWords = 'mainnet (or unknown network) 🥵'
  if (networkSupported) {
    networkWords = `the ${networkName} testnet 👍`
  }

  return <div
    className={classnames(
      'text-sm sm:text-base lg:text-lg sm:px-6 py-2 sm:py-3',
      {
        'text-white bg-red': !networkSupported,
        'text-highlight-2 bg-purple': networkSupported,
      }
    )}
  >
    <div
      className='text-center px-4'
    >
      This works on Ropsten, Rinkeby, Kovan and localhost.
      Your wallet is currently set to <span className='font-bold'>{networkWords}</span>
    </div>
  </div>
}