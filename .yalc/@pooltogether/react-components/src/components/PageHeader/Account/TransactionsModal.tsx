import React from 'react'

import { WalletInfo } from './WalletInfo'
import { TransactionsList } from './TransactionsList'
import { Modal } from '../../Modal/Modal'

export const TransactionsModal = (props) => {
  const { t, disconnectWallet, walletName, chainId, usersAddress, isOpen, closeModal } = props

  return (
    <Modal
      isOpen={isOpen}
      closeModal={closeModal}
      label='transactions modal'
      paddingClassName='p-0'
      maxWidthClassName='max-w-4xl'
    >
      <div className='p-8'>
        <WalletInfo
          usersAddress={usersAddress}
          chainId={chainId}
          disconnectWallet={disconnectWallet}
          walletName={walletName}
          closeModal={closeModal}
        />
      </div>
      <div className='p-8 bg-primary rounded-none sm:rounded-b-xl'>
        <TransactionsList
          t={t}
          closeTransactions={closeModal}
          chainId={chainId}
          usersAddress={usersAddress}
        />
      </div>
    </Modal>
  )
}
