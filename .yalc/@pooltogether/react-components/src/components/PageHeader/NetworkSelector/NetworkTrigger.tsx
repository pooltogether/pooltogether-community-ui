import React from 'react'
import classnames from 'classnames'
import { ScreenSize, useScreenSize } from '@pooltogether/hooks'
import { getNetworkNiceNameByChainId } from '@pooltogether/utilities'

import { networkTextColorClassname } from '../../../utils/networkColorClassnames'
import { NetworkIcon } from '../../Icons/NetworkIcon'

export const NetworkTrigger = (props) => {
  const { openModal, className, chainId } = props
  const screenSize = useScreenSize()

  const networkName = getNetworkNiceNameByChainId(chainId)

  if (screenSize <= ScreenSize.sm) {
    return <NetworkIcon onClick={openModal} className={className} chainId={chainId} />
  }

  return (
    <button
      onClick={openModal}
      className={classnames(
        'transition tracking-wide flex items-center capitalize font-bold',
        'hover:text-inverse text-xxs sm:text-xs sm:px-2 py-1',
        `text-${networkTextColorClassname(chainId)}`,
        className
      )}
    >
      <NetworkIcon className='mr-2' chainId={chainId} />
      <span className='capitalize hidden sm:block'>{networkName}</span>
    </button>
  )
}
