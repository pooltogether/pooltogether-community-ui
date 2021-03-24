import React, { useContext, useEffect, useState } from 'react'
import classnames from 'classnames'

import { WalletContext } from 'lib/components/WalletContextProvider'
import { SUPPORTED_NETWORKS } from 'lib/constants'
import { chainIdToName, NETWORK_DATA } from 'lib/utils/networks'
import { CloseBannerButton } from 'lib/components/NotificationBanners'

export const StaticNetworkNotificationBanner = ({}) => {
  const walletContext = useContext(WalletContext)
  const [userHasClosedBanner, setUserHasClosedBanner] = useState(false)

  const { _onboard } = walletContext || {}
  const chainId = _onboard.getState().appNetworkId
  const networkSupported = SUPPORTED_NETWORKS.includes(chainId)

  useEffect(() => {
    setUserHasClosedBanner(false)
  }, [chainId])

  if (!_onboard.getState().wallet.name || networkSupported || userHasClosedBanner) {
    return null
  }

  const networkName = chainIdToName(chainId)

  const supportedNames = SUPPORTED_NETWORKS.reduce((names, networkId) => {
    const name = NETWORK_DATA?.[networkId]?.view
    if (name && names.indexOf(name) == -1) {
      names.push(name)
    }
    return names
  }, []).join(', ')

  let networkWords = `${networkName} 🥵`

  return (
    <div
      className={classnames(
        'text-sm sm:text-base lg:text-lg sm:px-6 py-2 sm:py-3 text-white bg-red-1 relative'
      )}
    >
      <div className='text-center px-4'>
        This works on <b>{supportedNames}</b>. Your wallet is currently set to <b>{networkWords}</b>
      </div>
      <CloseBannerButton closeBanner={() => setUserHasClosedBanner(true)} />
    </div>
  )
}
