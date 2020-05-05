import React, { useContext } from 'react'

import { Button } from 'lib/components/Button'
import { Forms } from 'lib/components/Forms'
import { WalletContext } from 'lib/components/WalletContextProvider'

import PoolIcon from 'assets/images/holidays.svg'

export const IndexContent = (
  props,
) => {
  const walletContext = useContext(WalletContext)

  const handleConnect = (e) => {
    e.preventDefault()

    walletContext.handleConnectWallet()
  }

  const address = walletContext._onboard.getState().address

  return <>
    <div
      className='mt-10 mb-10 sm:mb-20 lg:w-2/3'
    >
      <img src={PoolIcon} className='inline-block w-10 h-10 ml-2' />
      <div
        className='text-blue-400 title text-xl sm:text-3xl'
      >
        v3.0 - Reference Frontend
      </div>

      <a
        href='https://docs.pooltogether.com'
        className='trans'
      >View documentation</a>
    </div>

    {address ?
      <Forms
        {...props}
      /> :
      <Button
        color='green'
        className='button'
        onClick={handleConnect}
      >
        Connect Wallet
      </Button>
    }
  </>
}
