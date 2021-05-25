import React, { useContext } from 'react'
import { useOnboard } from '@pooltogether/hooks'
import classnames from 'classnames'
import FeatherIcon from 'feather-icons-react'
import { getChain } from '@pooltogether/evm-chains-extended'

import { NetworkIcon } from 'lib/components/NetworkIcon'
import { useEnsName } from 'lib/hooks/useEnsName'
import { networkColorClassname } from 'lib/utils/networks'
import { shorten } from 'lib/utils/shorten'
import { BlockExplorerLink } from 'lib/components/BlockExplorerLink'

export const WalletInfo = () => {
  const { address, walletName, network, disconnectWallet } = useOnboard()

  let chainId = 1

  if (network) {
    chainId = network
  }

  const { shortenedEnsName } = useEnsName(address)

  let innerContent = null
  let networkNameJsx = null

  if (chainId) {
    let network = {}
    let networkName = 'unknown network'
    try {
      network = getChain(chainId)
      networkName = network.name || network.network
    } catch (error) {
      // console.warn(error)
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
        <div className='flex flex-col items-end leading-snug text-highlight-3 trans'>
          <span className='text-highlight-3 hover:text-highlight-1 overflow-ellipsis block w-full no-underline'>
            <BlockExplorerLink address={address}>
              {shortenedEnsName ? shortenedEnsName : shorten(address)}
            </BlockExplorerLink>
          </span>

          <span className='flex items-center text-default'>{walletName}</span>

          <span className='flex items-center'>
            <NetworkIcon sizeClasses='w-3 h-3' chainId={chainId} />
            {networkNameJsx}
          </span>
        </div>

        <button
          onClick={disconnectWallet}
          className={classnames(
            'text-lightPurple-500 hover:text-white trans ml-2 outline-none focus:outline-none',
            'block border rounded-full w-4 h-4 text-center text-lg',
            'border-purple-700 hover:bg-lightPurple-700',
            'trans'
          )}
        >
          <FeatherIcon icon='x' className={classnames('w-3 h-3 hover:text-white m-auto')} />
        </button>
      </>
    )
  }

  return <div className='relative flex justify-end items-center'>{innerContent}</div>
}
