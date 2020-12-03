import { ethers } from 'ethers'
import { CompleteAwardUI } from 'lib/components/CompleteAwardUI'
import { FormLockedOverlay } from 'lib/components/FormLockedOverlay'
import { StartAwardUI } from 'lib/components/StartAwardUI'
import { UserActionsUI } from 'lib/components/UserActionsUI'
import { UserStats } from 'lib/components/UserStats'
import { WalletContext } from 'lib/components/WalletContextProvider'
import React, { useContext, useEffect, useState } from 'react'

export const InteractUI = (props) => {
  const { poolChainValues, usersChainValues, poolAddresses } = props

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

  return (
    <>
      <div className='relative py-4 sm:py-6 text-center'>
        {usersAddress && (
          <>
            <div className='my-4 p-10 bg-card rounded-lg mb-10'>
              <StartAwardUI {...props} />
              <CompleteAwardUI {...props} />
            </div>
          </>
        )}

        {ethBalance && ethBalance.eq(0) && (
          <>
            <FormLockedOverlay
              flexColJustifyClass='justify-start'
              title={`Deposit & Withdraw`}
              zLayerClass='z-30'
            >
              <>
                Your ETH balance is 0.
                <br />
                To interact with the contracts you will need ETH.
              </>
            </FormLockedOverlay>
          </>
        )}

        {!usersAddress && (
          <FormLockedOverlay
            flexColJustifyClass='justify-start'
            title={`Deposit & Withdraw`}
            zLayerClass='z-30'
          >
            <>
              <div>To interact with the contracts first connect your wallet:</div>

              <div className='flex justify-center mt-3 sm:mt-5 mb-5'>
                <button
                  className='font-bold rounded-full text-green border-2 sm:border-4 border-green hover:text-white hover:bg-purple text-xxs sm:text-base pt-2 pb-2 px-3 sm:px-6 trans'
                  onClick={handleConnect}
                >
                  Connect Wallet
                </button>
              </div>
            </>
          </FormLockedOverlay>
        )}

        <UserStats poolChainValues={poolChainValues} usersChainValues={usersChainValues} />

        <UserActionsUI
          poolChainValues={poolChainValues}
          poolAddresses={poolAddresses}
          usersChainValues={usersChainValues}
        />
      </div>
    </>
  )
}
