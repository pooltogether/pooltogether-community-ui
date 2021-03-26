import { WalletContext } from 'lib/components/WalletContextProvider'
import { useContext } from 'react'

// TODO: Add ENS!!
export const useUsersAddress = () => {
  const walletContext = useContext(WalletContext)
  return walletContext._onboard.getState().address
}
