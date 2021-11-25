import React, { useState } from 'react'

import { AccountButton } from './AccountButton'
import { TransactionsModal } from './TransactionsModal'
import { ConnectWalletButton } from './ConnectWalletButton'

// TODO: Pending inside the account button like Uniswap
export function Account (props) {
  const {
    t,
    className,
    isWalletConnected,
    disconnectWallet,
    provider,
    chainId,
    usersAddress,
    connectWallet,
    walletName
  } = props

  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {isWalletConnected && (
        <AccountButton
          t={t}
          usersAddress={usersAddress}
          openModal={() => setIsOpen(true)}
          className={className}
          provider={provider}
        />
      )}
      {!isWalletConnected && (
        <ConnectWalletButton connectWallet={connectWallet} t={t} className={className} />
      )}
      <TransactionsModal
        t={t}
        chainId={chainId}
        usersAddress={usersAddress}
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
        disconnectWallet={disconnectWallet}
        walletName={walletName}
      />
    </>
  )
}
