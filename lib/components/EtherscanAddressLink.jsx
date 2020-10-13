import React from 'react'
import FeatherIcon from 'feather-icons-react'

import { formatEtherscanAddressUrl } from 'lib/utils/formatEtherscanAddressUrl'
import { nameToChainId } from 'lib/utils/nameToChainId'
import { shorten } from 'lib/utils/shorten'

export const EtherscanAddressLink = (props) => {
  const {
    address,
    children,
    className,
    networkName,
    size,
  } = props

  const chainId = nameToChainId(networkName)
  const url = formatEtherscanAddressUrl(address, chainId)

  let textSizeClasses = 'text-xs sm:text-base lg:text-lg'
  if (size === 'xxs') {
    textSizeClasses = 'text-xxs sm:text-xs lg:text-sm'
  }

  return <>
    <a
      href={url}
      className={`trans ${textSizeClasses} ${className} font-number`}
      target='_blank'
      rel='noopener noreferrer'
      title='View on Etherscan'
    >
      <div className='inline-block xs:hidden'>
        {shorten(children)}
      </div><div className='hidden xs:inline-block'>
        {children}
      </div>  <FeatherIcon
        icon='external-link'
        className='is-etherscan-arrow inline-block'
      />
    </a>
  </>
}