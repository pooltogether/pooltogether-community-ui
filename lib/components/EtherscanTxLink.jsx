import React from 'react'
import FeatherIcon from 'feather-icons-react'

import { formatEtherscanTxUrl } from 'lib/utils/formatEtherscanTxUrl'

export const EtherscanTxLink = (props) => {
  const { children, className, hash, chainId } = props

  const url = formatEtherscanTxUrl(hash, chainId)

  return (
    <>
      <a
        href={url}
        className={`no-underline ${className} font-number`}
        target='_blank'
        rel='noopener noreferrer'
        title='View on Etherscan'
      >
        {children} <FeatherIcon icon='external-link' className='is-etherscan-arrow inline-block' />
      </a>
    </>
  )
}
