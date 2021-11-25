import React from 'react'
import { useAtom } from 'jotai'
import { transactionsAtom } from '@pooltogether/hooks'

import { ThemedClipSpinner } from '../../Loading/ThemedClipSpinner'

export function PendingTxButton(props) {
  const { t, openModal } = props
  const [transactions] = useAtom(transactionsAtom)
  const pendingTransactionsCount = transactions.filter((t) => !t.completed).length

  if (pendingTransactionsCount < 1) {
    return null
  }

  return (
    <button
      onClick={openModal}
      className='items-center text-highlight-1 hover:text-inverse font-bold text-xxs sm:text-xs trans tracking-wider outline-none focus:outline-none active:outline-none relative block xs:ml-2 px-2 h-8'
    >
      <div className='inline-block mr-1'>
        <ThemedClipSpinner size={10} />
      </div>{' '}
      {t?.('pendingTransactionsCount', { count: pendingTransactionsCount }) ||
        `${pendingTransactionsCount} pending`}
    </button>
  )
}
