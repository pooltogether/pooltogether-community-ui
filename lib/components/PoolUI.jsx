import React, { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'

import { EtherscanAddressLink } from 'lib/components/EtherscanAddressLink'
import { FormLockedOverlay } from 'lib/components/FormLockedOverlay'
import { LoadingDots } from 'lib/components/LoadingDots'
import { PoolActionsUI } from 'lib/components/PoolActionsUI'
import { UserActionsUI } from 'lib/components/UserActionsUI'
import { UserStats } from 'lib/components/UserStats'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { useInterval } from 'lib/hooks/useInterval'
import { fetchChainData } from 'lib/utils/fetchChainData'
import { getEthBalance } from 'lib/utils/getEthBalance'
import { poolToast } from 'lib/utils/poolToast'

export const PoolUI = (
  props,
) => {
  const router = useRouter()
  const networkName = router.query.networkName
  const pool = router.query.poolAddress

  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider
  const usersAddress = walletContext._onboard.getState().address

  const [ethBalance, setEthBalance] = useState(ethers.utils.bigNumberify(0))
  const [poolAddresses, setPoolAddresses] = useState({
    pool
  })
  const [genericChainValues, setGenericChainValues] = useState({
    loading: true,
    erc20Symbol: 'TOKEN',
    poolTotalSupply: '1234',
  })

  const [usersChainValues, setUsersChainValues] = useState({
    loading: true,
    usersTicketBalance: ethers.utils.bigNumberify(0),
    usersERC20Allowance: ethers.utils.bigNumberify(0),
    usersERC20Balance: ethers.utils.bigNumberify(0),
  })


  try {
    ethers.utils.getAddress(pool)
  } catch (e) {
    return 'Incorrectly formatted Ethereum address!'
  }


  useInterval(() => {
    fetchChainData(
      networkName,
      usersAddress,
      poolAddresses,
      setPoolAddresses,
      setGenericChainValues,
      setUsersChainValues,
    )
  }, 5000)

  useEffect(() => {
    fetchChainData(
      networkName,
      usersAddress,
      poolAddresses,
      setPoolAddresses,
      setGenericChainValues,
      setUsersChainValues,
    )
  }, [provider, usersAddress, poolAddresses])

  useEffect(() => {
    getEthBalance(walletContext, setEthBalance)
  }, [walletContext])

  if (poolAddresses.error) {
    console.warn(poolAddresses.errorMessage)
    alert(`Error fetching data for pool with address: ${pool}, wrong Ethereum network?`)
    // poolToast.error(`Error+fetching+data+for+pool+with+address+${pool}`)
    router.push(
      `/`,
      `/`,
      {
        shallow: true
      }
    )
    return null
  }



  const handleConnect = (e) => {
    e.preventDefault()

    walletContext.handleConnectWallet()
  }

  return <>
    {genericChainValues.loading ?
      <div
        className='text-center text-xl'
      >
        <LoadingDots />
        <br/>
        Fetching chain values ...
      </div>
    : <>
      <div className='bg-purple-1000 px-4 sm:px-8 lg:px-20 py-8 sm:py-10 mb-4 text-center rounded-lg'>
        <div
          className='mb-6'
        >
          Contract address:
          <br /> <EtherscanAddressLink
            address={poolAddresses.pool}
            networkName={networkName}
          >
            {poolAddresses.pool}
          </EtherscanAddressLink>
        </div>

        <PoolActionsUI
          genericChainValues={genericChainValues}
          networkName={networkName}
          poolAddresses={poolAddresses}
          usersAddress={usersAddress}
        />
      </div>

      <div
        className='relative bg-purple-1000 px-4 sm:px-8 lg:px-20 py-8 sm:py-10 text-center rounded-lg my-4'
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
              className='mt-3 sm:mt-5 mb-5'
            >
              <button
                className='font-bold rounded-full text-green-300 border-2 sm:border-4 border-green-300 hover:text-white hover:bg-lightPurple-900 text-xxs sm:text-base pt-2 pb-2 px-3 sm:px-6 trans'
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
    </>}
  </>
}
