import React from 'react'
import { getNetworkNiceNameByChainId } from '@pooltogether/utilities'
import { Token } from '@pooltogether/hooks'

import { poolToast } from '../../services/poolToast'
import { addTokenToMetamask } from '../../services/addTokenToMetamask'

const TOKEN_IMG_URL = {
  PTaUSDC: 'https://app.pooltogether.com/ptausdc@2x.png'
}

export interface IAddTokenToMetamaskButtonProps {
  t: object
  isMetaMask: boolean
  isWalletOnProperNetwork: boolean
  chainId: number
  token: Token
  className?: string
  children?: React.ReactNode
}

// needs to handle which network the user is on

export function AddTokenToMetamaskButton(props) {
  const { children, className, t, chainId, isWalletOnProperNetwork, token } = props

  const currentNetworkName = getNetworkNiceNameByChainId(chainId)

  if (!token) {
    return null
  }

  const handleAddTokenToMetamask = async (e) => {
    e.preventDefault()

    if (!isWalletOnProperNetwork) {
      poolToast.warn(
        t('switchToNetworkToAddToken', `Switch to {{networkName}} to add token '{{token}}'`, {
          networkName: currentNetworkName,
          token: token.symbol
        })
      )
      return null
    }

    const tokenImageUrl = token.symbol === 'PTaUSDC' ? TOKEN_IMG_URL.PTaUSDC : undefined

    addTokenToMetamask(token.symbol, token.address, Number(token.decimals), tokenImageUrl)
  }

  return (
    <button onClick={handleAddTokenToMetamask} className={className}>
      {children ||
        t('addTicketTokenToMetamask', {
          token: token.symbol
        })}
    </button>
  )
}

AddTokenToMetamaskButton.defaultProps = {
  className: `trans hover:opacity-90 cursor-pointer inline-flex items-center`
}
