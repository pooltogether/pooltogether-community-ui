import React from 'react'

import { Button } from '../../Buttons/Button'

export const ConnectWalletButton = (props) => {
  const { connectWallet, t, className } = props

  return (
    <Button onClick={() => connectWallet()} textSize='xxxs' className={className}>
      {t?.('connectWallet') || 'Connect wallet'}
    </Button>
  )
}
