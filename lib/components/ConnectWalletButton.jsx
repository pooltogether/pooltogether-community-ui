import React from 'react'
import { useOnboard } from '@pooltogether/hooks'

import { Button } from 'lib/components/Button'

export const ConnectWalletButton = (props) => {
  const { children, ...buttonProps } = props
  const { connectWallet } = useOnboard()

  return (
    <Button type='button' onClick={connectWallet} {...buttonProps}>
      {children}
    </Button>
  )
}

ConnectWalletButton.defaultProps = {
  size: 'lg',
  color: 'secondary',
  children: 'Connect Wallet',
  fullWidth: 'true'
}
