import React, { useContext } from 'react'
import { getChain } from 'evm-chains-extended'

import { WalletContext } from 'lib/components/WalletContextProvider'
import { SUPPORTED_NETWORKS } from 'lib/constants'
import { NotificationBanner } from 'lib/components/NotificationBanners'

export const StaticNetworkNotificationBanner = () => {
  const walletContext = useContext(WalletContext)
  const { _onboard } = walletContext || {}

  const chainId = _onboard.getState().appNetworkId
  const networkSupported = SUPPORTED_NETWORKS.includes(chainId)

  if (!chainId || !_onboard.getState().wallet.name || networkSupported) {
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

  const networkName = getChain(chainId)?.network || 'unknown'

  let supportedNames = []
  SUPPORTED_NETWORKS.forEach((networkId) => {
    if (networkId === 31337 || networkId === 31337) {
      return
    }

    const { shortName, network } = getChain(networkId)
    console.log(networkId)
    console.log(shortName, network)
    const name = `${shortName} ${network}`
    console.log(name)

    // if (name && names.indexOf(name) == -1) {
    //   names.push(name)
    // }
    supportedNames.push(name)
  })
  supportedNames = supportedNames.join(', ')

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
