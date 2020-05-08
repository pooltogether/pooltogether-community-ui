import React, { useContext } from 'react'
import classnames from 'classnames'

import { WalletContext } from 'lib/components/WalletContextProvider'

export const StaticNetworkNotificationBanner = ({
}) => {
  let chainId
  const walletContext = useContext(WalletContext)
  const { _onboard } = walletContext || {}

  if (!_onboard.getState().wallet.name) {
    return null
  }

  chainId = _onboard.getState().appNetworkId

  let networkWords = 'mainnet 🥵'
  if (chainId === 42) {
    networkWords = `the Kovan testnet 👍`
  } else if (chainId === 31337) {
    networkWords = `the localhost 👍`
  }

  return <div
    className={classnames(
      'text-white text-xs sm:text-base lg:text-lg sm:px-6 py-2 sm:py-3',
      {
        'bg-red-800': chainId !== 42 && chainId !== 31337,
        'bg-purple-1000': chainId === 42 || chainId === 31337,
      }
    )}
  >
    <div
      className='text-center px-4 pb-1 sm:pb-0'
    >
      This works on Kovan and localhost.
      Your wallet is currently set to <span className='font-bold'>{networkWords}</span>
    </div>
  </div>
}