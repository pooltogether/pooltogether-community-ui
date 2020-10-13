import React, { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'

import { FormLockedOverlay } from 'lib/components/FormLockedOverlay'
import { UserActionsUI } from 'lib/components/UserActionsUI'
import { UserStats } from 'lib/components/UserStats'
import { WalletContext } from 'lib/components/WalletContextProvider'

export const InteractUI = (
  props,
) => {
  const { genericChainValues, usersChainValues, poolAddresses } = props

  const walletContext = useContext(WalletContext)
  const usersAddress = walletContext._onboard.getState().address

  const [ethBalance, setEthBalance] = useState(ethers.utils.bigNumberify(0))
  
  useEffect(() => {
    const balance = walletContext.state.onboard.getState().balance
    if (balance) {
      setEthBalance(ethers.utils.bigNumberify(balance))
    }
  }, [walletContext])

  const handleConnect = (e) => {
    e.preventDefault()

    walletContext.handleConnectWallet()
  }

  return <>
    <div
      className='relative py-4 sm:py-6 text-center rounded-lg'
    >
      {ethBalance && ethBalance.eq(0) && <>
        <FormLockedOverlay
          flexColJustifyClass='justify-start'
          title={`Deposit & Withdraw`}
          zLayerClass='z-30'
        >
          <>
            Your ETH balance is 0.
            <br />To interact with the contracts you will need ETH.
          </>
        </FormLockedOverlay>
      </>}


      {!usersAddress && <FormLockedOverlay
        flexColJustifyClass='justify-start'
        title={`Deposit & Withdraw`}
        zLayerClass='z-30'
      >
        <>
          <div>
            To interact with the contracts first connect your wallet:
          </div>

          <div
              className='flex justify-center mt-3 sm:mt-5 mb-5'
          >
            <button
                className='font-bold rounded-full text-green border-2 sm:border-4 border-green hover:text-white hover:bg-purple text-xxs sm:text-base pt-2 pb-2 px-3 sm:px-6 trans'
              onClick={handleConnect}
            >
              Connect Wallet
            </button>
          </div>
        </>
      </FormLockedOverlay>}

      <UserStats
        genericChainValues={genericChainValues}
        usersChainValues={usersChainValues}
      />

      <UserActionsUI
        genericChainValues={genericChainValues}
        poolAddresses={poolAddresses}
        usersChainValues={usersChainValues}
      />
    </div>
  </>
}
