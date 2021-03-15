import React from 'react'
import FeatherIcon from 'feather-icons-react'

import { formatEtherscanAddressUrl } from 'lib/utils/formatEtherscanAddressUrl'
import { shorten } from 'lib/utils/shorten'
import { useNetwork } from 'lib/hooks/useNetwork'

export const EtherscanAddressLink = (props) => {
  const { address, children, className, networkName, size } = props
  const [chainId] = useNetwork()
  const url = formatEtherscanAddressUrl(address, chainId)

  let textSizeClasses = 'text-sm sm:text-xl'
  if (size === 'xxs') {
    textSizeClasses = 'text-xs sm:text-base'
  }

  return (
    <>
      <a
        href={url}
        className={`trans ${textSizeClasses} ${className}`}
        target='_blank'
        rel='noopener noreferrer'
        title='View on Etherscan'
      >
        <div className='inline-block xs:hidden'>{shorten(children)}</div>
        <div className='hidden xs:inline-block'>{children}</div>{' '}
        <FeatherIcon icon='external-link' className='is-etherscan-arrow inline-block' />
      </a>
    </>
  )
}
