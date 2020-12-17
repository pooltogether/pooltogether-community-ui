import classnames from 'classnames'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { SUPPORTED_NETWORKS } from 'lib/constants'
import { chainIdToName } from 'lib/utils/chainIdToName'
import React, { useContext } from 'react'

export const StaticNetworkNotificationBanner = ({}) => {
  let chainId
  const walletContext = useContext(WalletContext)
  const { _onboard } = walletContext || {}

  if (!_onboard.getState().wallet.name) {
    return null
  }

  chainId = _onboard.getState().appNetworkId
  const networkName = chainIdToName(chainId)

  const supportedNames = SUPPORTED_NETWORKS.reduce((names, networkId) => {
    const name = chainIdToName(networkId)
    if (name && names.indexOf(name) == -1) {
      names.push(name)
    }
    return names
  }, []).join(', ')

  const networkSupported = SUPPORTED_NETWORKS.includes(chainId)

  let networkWords = `${networkName} 🥵`
  if (networkSupported) {
    networkWords = `${networkName} 👍`
  }

  return (
    <div
      className={classnames('text-sm sm:text-base lg:text-lg sm:px-6 py-2 sm:py-3', {
        'text-white bg-red-1': !networkSupported,
        'text-default bg-purple-1': networkSupported
      })}
    >
      <div className='text-center px-4'>
        This works on {supportedNames}. Your wallet is currently set to{' '}
        <span className='font-bold'>{networkWords}</span>
      </div>
    </div>
  )
}
