import { Button } from 'lib/components/Button'
import { WalletContext } from 'lib/components/WalletContextProvider'
import React, { useContext } from 'react'

export const ConnectWalletButton = (props) => {
  const { children, ...buttonProps } = props
  const walletContext = useContext(WalletContext)

  const handleConnect = (e) => {
    e.preventDefault()

    walletContext.handleConnectWallet()
  }

  return (
    <Button type='button' onClick={handleConnect} {...buttonProps}>
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
