import React from 'react'
import classnames from 'classnames'

// import EthLogo from '@pooltogether/evm-chains-extended/dist/umd/images/eth-logo.png'
import BscLogo from '@pooltogether/evm-chains-extended/dist/umd/images/bsc-logo.png'
import PoALogo from '@pooltogether/evm-chains-extended/dist/umd/images/poa-logo.png'
import XDaiLogo from '@pooltogether/evm-chains-extended/dist/umd/images/xdai-logo.png'
import PolygonLogo from '@pooltogether/evm-chains-extended/dist/umd/images/polygon-matic-logo.png'

import { ETHEREUM_NETWORKS } from 'lib/constants'

export const NetworkIcon = (props) => {
  const { className, chainId } = props

  const noMargin = props.noMargin || false
  const sizeClasses = props.sizeClasses || 'w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10'

  let src
  if (ETHEREUM_NETWORKS.includes(chainId)) {
    // src = EthLogo
  } else if (chainId === 97 || chainId === 56) {
    src = BscLogo
  } else if (chainId === 77 || chainId === 99) {
    src = PoALogo
  } else if (chainId === 100) {
    src = XDaiLogo
  } else if (chainId === 137 || chainId === 80001) {
    src = PolygonLogo
  }

  // Fallback to placeholder
  if (!src) {
    src = '/network-placeholder.png'
  }

  const classes = classnames(sizeClasses, {
    [className]: className,
    'inline-block': !className,
    'mr-1': !noMargin
  })

  return <img src={src} className={classes} />
}
