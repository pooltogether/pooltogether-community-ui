import React from 'react'
import classnames from 'classnames'
import { NETWORK } from '@pooltogether/utilities'

// Networks
import DefaultNetworkLogo from '../../assets/Networks/network-icon.png'
import EthLogo from '../../assets/Networks/ethereum-icon.png'
import BscLogo from '../../assets/Networks/bsc-icon.png'
import PoALogo from '../../assets/Networks/poa-icon.png'
import XDaiLogo from '../../assets/Networks/xdai-icon.png'
import PolygonLogo from '../../assets/Networks/polygon-icon.png'
import CeloColoredLogo from '../../assets/Networks/celo-colored.png'

export const NetworkIcon = (props) => {
  const { sizeClassName, className, chainId, onClick } = props

  const src = NETWORK_MAPPING[chainId] || DefaultNetworkLogo

  return (
    <img
      src={src}
      className={classnames('rounded-full inline-block', className, sizeClassName)}
      onClick={onClick}
    />
  )
}

NetworkIcon.defaultProps = {
  sizeClassName: 'w-5 h-5'
}

export const NETWORK_MAPPING = Object.freeze({
  [NETWORK.mainnet]: EthLogo,
  [NETWORK.rinkeby]: EthLogo,
  [NETWORK.goerli]: EthLogo,
  [NETWORK.kovan]: EthLogo,
  [NETWORK.bsc]: BscLogo,
  [NETWORK.poa]: PoALogo,
  [NETWORK.xdai]: XDaiLogo,
  [NETWORK.polygon]: PolygonLogo,
  [NETWORK.mumbai]: PolygonLogo,
  [NETWORK.celo]: CeloColoredLogo
})
