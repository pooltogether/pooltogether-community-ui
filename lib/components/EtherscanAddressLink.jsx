import React from 'react'
import FeatherIcon from 'feather-icons-react'
import { useAtom } from 'jotai'

import { formatEtherscanAddressUrl } from 'lib/utils/formatEtherscanAddressUrl'
import { shorten } from 'lib/utils/shorten'
import { networkAtom } from 'lib/hooks/useNetwork'

export const EtherscanAddressLink = (props) => {
  const { address, children, className, networkName, size } = props
  const [network] = useAtom(networkAtom)
  const url = formatEtherscanAddressUrl(address, network.id)

  let textSizeClasses = 'text-sm sm:text-xl'
  if (size === 'xxs') {
    textSizeClasses = 'text-xs sm:text-base'
  }

  return (
    <>
      <a
        href={url}
        className={`trans ${textSizeClasses} font-number ${className}`}
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
