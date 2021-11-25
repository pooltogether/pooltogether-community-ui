import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { transactionsAtom } from '@pooltogether/hooks'

const deepEqual = require('deep-equal')

const debug = require('debug')('pool-app:TxRefetchListener')

export function TxRefetchListener() {
  const [transactions] = useAtom(transactionsAtom)

  const [storedPendingTransactions, setStoredPendingTransactions] = useState([])

  const pendingTransactions = transactions.filter((t) => !t.completed && !t.cancelled)

  useEffect(() => {
    // Only run this if something actually changed:
    if (!deepEqual(storedPendingTransactions, pendingTransactions)) {
      setStoredPendingTransactions(pendingTransactions)
      checkStoredPending(transactions, storedPendingTransactions)
    }
  }, [transactions])

  return null
}

const runRefetch = (tx) => {
  // we don't know when the Graph will have processed the new block data or when it has
  // so simply query a few times for the updated data

  if (tx?.refetch) {
    tx.refetch(tx)
    setTimeout(() => {
      tx.refetch(tx)
      debug('refetch!')
    }, 2000)

    setTimeout(() => {
      tx.refetch(tx)
      debug('refetch!')
    }, 8000)
  }
}

const checkStoredPending = (transactions, storedPendingTransactions) => {
  storedPendingTransactions.forEach((tx) => {
    const storedTxId = tx.id
    const currentTxState = transactions.find((_tx) => _tx.id === storedTxId)

    const completed = currentTxState?.completed
    const sent = currentTxState?.sent
    const error = currentTxState?.error
    const cancelled = currentTxState?.cancelled

    if (!cancelled && !completed && sent) {
      tx?.onSent?.(tx)
    } else if (completed && !error && !cancelled) {
      tx?.onSuccess?.(tx)
      runRefetch(tx)
    } else if (currentTxState && completed && error && !cancelled) {
      tx?.onError?.(tx)
    } else if (currentTxState?.cancelled) {
      tx?.onCancelled?.(tx)
    }
  })
}
