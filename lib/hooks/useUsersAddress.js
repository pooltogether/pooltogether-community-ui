import { atom, useAtom } from 'jotai'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { useContext, useEffect } from 'react'

export const usersAddressAtom = atom('')

export const useUsersAddress = () => {
  const walletContext = useContext(WalletContext)
  const usersAddress = walletContext._onboard.getState().address
  const [_usersAddress, setUsersAddress] = useAtom(usersAddressAtom)

  useEffect(() => {
    setUsersAddress(usersAddress)
  }, [usersAddress])

  return [_usersAddress, setUsersAddress]
}
