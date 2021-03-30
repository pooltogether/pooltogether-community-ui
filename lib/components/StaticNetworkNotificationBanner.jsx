import React, { useContext, useEffect, useState } from 'react'
import classnames from 'classnames'

import { WalletContext } from 'lib/components/WalletContextProvider'
import { SUPPORTED_NETWORKS } from 'lib/constants'
import { chainIdToName, NETWORK_DATA } from 'lib/utils/networks'
import { CloseBannerButton, NotificationBanner } from 'lib/components/NotificationBanners'

export const StaticNetworkNotificationBanner = () => {
  const walletContext = useContext(WalletContext)
  const { _onboard } = walletContext || {}

  const chainId = _onboard.getState().appNetworkId
  const networkSupported = SUPPORTED_NETWORKS.includes(chainId)

  if (!_onboard.getState().wallet.name || networkSupported) {
    return null
  }

  return (
    <NotificationBanner className='bg-red-1'>
      <StaticNetworkNotification chainId={chainId} />
    </NotificationBanner>
  )
}

const StaticNetworkNotification = (props) => {
  const { chainId } = props

  const networkName = NETWORK_DATA?.[chainId]?.view || 'Unknown'

  const supportedNames = SUPPORTED_NETWORKS.reduce((names, networkId) => {
    const name = NETWORK_DATA?.[networkId]?.view
    if (name && names.indexOf(name) == -1) {
      names.push(name)
    }
    return names
  }, []).join(', ')

  let networkWords = `${networkName} 🥵`

  return (
    <div className='flex flex-col'>
      <span>
        This pool lives on <b>{supportedNames}</b>.
      </span>
      <span>
        Your wallet is currently set to <b>{networkWords}.</b>
      </span>
    </div>
  )
}
