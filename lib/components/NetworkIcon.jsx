import React from 'react'
import classnames from 'classnames'

import EthLogo from '@pooltogether/evm-chains-extended/dist/umd/images/eth-logo.png'
import BscLogo from '@pooltogether/evm-chains-extended/dist/umd/images/bsc-logo.png'
import BscLogo2 from '@pooltogether/evm-chains-extended/dist/umd/images/bsc-logo-2.png'
import PoALogo from '@pooltogether/evm-chains-extended/dist/umd/images/poa-logo.png'
import XDaiLogo from '@pooltogether/evm-chains-extended/dist/umd/images/xdai-logo.png'
import PolygonLogo from '@pooltogether/evm-chains-extended/dist/umd/images/polygon-logo.png'

import { ETHEREUM_NETWORKS } from 'lib/constants'

export const NetworkIcon = (props) => {
  const { className, noMediaQueries, sm, lg, xl, xs, chainId } = props

  const noMargin = props.noMargin || false

  let src
  if (ETHEREUM_NETWORKS.includes(chainId)) {
    src = EthLogo
  } else if (chainId === 97) {
    src = BscLogo
  } else if (chainId === 56) {
    src = BscLogo2
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

  let sizeClasses = 'w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10'
  if (isUndefined(noMediaQueries)) {
    if (xs) {
      sizeClasses = 'w-3 h-3 sm:w-5 sm:h-5 lg:w-6 lg:h-6'
    } else if (sm) {
      sizeClasses = 'w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8'
    } else if (lg) {
      sizeClasses = 'w-8 h-8 sm:w-14 sm:h-14'
    } else if (xl) {
      sizeClasses = 'w-12 h-12 sm:w-16 sm:h-16 lg:w-18 lg:h-18'
    }
  } else {
    if (lg) {
      sizeClasses = 'w-10 h-10'
    } else if (xl) {
      sizeClasses = 'w-12 h-12'
    } else {
      sizeClasses = 'w-8 h-8'
    }
  }

  const classes = classnames(sizeClasses, {
    [className]: className,
    'inline-block': !className,
    'mr-1': !noMargin
  })

  return <img src={src} className={classes} />
}
