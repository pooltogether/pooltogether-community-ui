import React, { useContext } from 'react'

import { Button } from 'lib/components/Button'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { getDefaultPoolContractAddress } from 'lib/utils/getDefaultPoolContractAddress'

export const IndexContent = (
  props,
) => {
  const walletContext = useContext(WalletContext)
  const address = walletContext._onboard.getState().address

  const poolContractAddress = getDefaultPoolContractAddress(walletContext)

  const handleConnect = (e) => {
    e.preventDefault()

    walletContext.handleConnectWallet()
  }

  return <>
    {address ?
      <>
        Form for pool address or default pool for this network:
        {poolContractAddress}
      </> : <>
      <Button
        color='green'
        className='button'
        onClick={handleConnect}
      >
        Connect Wallet
      </Button>
    </>}
  </>
}
