import { useEffect } from 'react'
import { useAtom } from 'jotai'
import { readTransactions, transactionsAtom } from '@pooltogether/hooks'

export function TransactionStatusChecker (props) {
  const { transactionsKey, network: chainId, address: usersAddress, provider } = props
  const [transactions, setTransactions] = useAtom(transactionsAtom)

  useEffect(() => {
    if (chainId && usersAddress && provider) {
      readTransactions(
        transactions,
        setTransactions,
        chainId,
        usersAddress,
        provider,
        transactionsKey
      )
    }
  }, [chainId, usersAddress, provider])

  return null
}
