import React, { useContext } from 'react'
import classnames from 'classnames'
import FeatherIcon from 'feather-icons-react'
import { getChain } from '@pooltogether/evm-chains-extended'

import { WalletContext } from 'lib/components/WalletContextProvider'
import { networkColorClassname } from 'lib/utils/networks'
import { shorten } from 'lib/utils/shorten'

export const WalletInfo = () => {
  const walletContext = useContext(WalletContext)
  const { _onboard } = walletContext || {}
  const currentState = _onboard.getState()

  let address
  let walletName
  let chainId = 1

  if (currentState) {
    address = currentState.address
    walletName = currentState.wallet.name
    chainId = currentState.appNetworkId
  }

  let innerContent = null
  let networkNameJsx = null

  if (chainId && chainId !== 1) {
    const { network, name } = getChain(chainId)
    const formattedNetworkName = name
    let networkName = network

    if (name) {
      networkName = formattedNetworkName
    }

    networkNameJsx = (
      <span className={classnames(networkColorClassname(chainId), 'inline-block')}>
        {networkName}
      </span>
    )
  }

  if (address && walletName) {
    innerContent = (
      <>
        <div className='leading-snug text-highlight-3 trans'>
          <span className='text-highlight-3 hover:text-highlight-1 overflow-ellipsis block w-full no-underline'>
            {shorten(address)}
          </span>

          <span className='block sm:inline-block rounded-lg text-default'>
            {walletName} {networkNameJsx}
          </span>
        </div>

        <button
          onClick={() => _onboard.walletReset()}
          className={classnames(
            'text-lightPurple-500 hover:text-white trans ml-2 outline-none focus:outline-none',
            'block border rounded-full w-4 h-4 sm:w-5 sm:h-5 text-center text-lg',
            'border-purple-700 hover:bg-lightPurple-700',
            'trans'
          )}
        >
          <FeatherIcon icon='x' className={classnames('w-3 h-3 hover:text-white m-auto')} />
        </button>
      </>
    )
  }

  return (
    <>
      <div className='relative flex justify-end items-center'>{innerContent}</div>
    </>
  )
}
