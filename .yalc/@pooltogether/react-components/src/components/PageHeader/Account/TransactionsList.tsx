import React from 'react'
import { useAtom } from 'jotai'
import { clearPreviousTransactions, transactionsAtom } from '@pooltogether/hooks'

import { TransactionsListItem } from './TransactionsListItem'

export function TransactionsList (props) {
  const { t, usersAddress, chainId } = props

  const [transactions, setTransactions] = useAtom(transactionsAtom)

  const notCancelledTransactions = transactions.filter((t) => !t.cancelled).reverse()
  const pendingTransactionsCount = transactions.filter((t) => !t.completed && !t.cancelled).length
  const pastTransactionsCount = transactions.filter((t) => t.completed && !t.cancelled).length

  const handleClearPrevious = (e) => {
    e.preventDefault()

    if (usersAddress && chainId) {
      clearPreviousTransactions(transactions, setTransactions, usersAddress, chainId)
    }
  }

  if (!usersAddress) {
    return null
  }

  return (
    <>
      <div className=''>
        <div className='flex justify-between items-center text-xxs xs:text-xs uppercase font-bold text-accent-3 pb-4'>
          <div>
            {t?.('recentTransactions') || 'Recent transactions'}
            {pendingTransactionsCount > 0 && (
              <span className='text-accent-1 text-xxxs uppercase opacity-50 ml-2'>
                {t?.('pendingTransactionsCount', { count: pendingTransactionsCount }) ||
                  `${pendingTransactionsCount} pending`}
              </span>
            )}
          </div>

          {pastTransactionsCount > 0 && (
            <>
              <button
                onClick={handleClearPrevious}
                className='inline-block text-xxs bg-body rounded-full border-2 border-accent-4 px-2 trans trans-fastest font-bold'
              >
                {t?.('clearHistory') || 'Clear history'}
              </button>
            </>
          )}
        </div>
      </div>

      <div className='flex-grow relative flex flex-col w-full pb-2 text-xs sm:text-sm'>
        {notCancelledTransactions.length === 0 ? (
          <>
            <div className='text-default-soft uppercase text-xs'>
              {t?.('currentlyNoActiveTransactions') || 'No active transactions'}
            </div>
          </>
        ) : (
          <>
            <ul className='transactions-ui-list overflow-x-hidden overflow-y-auto'>
              {notCancelledTransactions.map((tx) => {
                return <TransactionsListItem key={tx.id} tx={tx} />
              })}
            </ul>
          </>
        )}
      </div>
    </>
  )
}
