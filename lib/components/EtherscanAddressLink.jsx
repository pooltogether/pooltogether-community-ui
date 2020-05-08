import React from 'react'
import FeatherIcon from 'feather-icons-react'

import { formatEtherscanAddressUrl } from 'lib/utils/formatEtherscanAddressUrl'
import { nameToChainId } from 'lib/utils/nameToChainId'

export const EtherscanAddressLink = (props) => {
  const {
    address,
    children,
    className,
    networkName,
  } = props

  const chainId = nameToChainId(networkName)
  const url = formatEtherscanAddressUrl(address, chainId)

  return <>
    <a
      href={url}
      className={`trans no-underline ${className}`}
      target='_blank'
      rel='noopener noreferrer'
      title='View on Etherscan'
    >
      {children}<FeatherIcon
        icon='arrow-up-right'
        className='is-etherscan-arrow inline-block'
      />
    </a>
  </>
}