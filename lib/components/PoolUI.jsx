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
import { poolToast } from 'lib/utils/poolToast'

import BatSvg from 'assets/images/bat.svg'
import DaiSvg from 'assets/images/dai.svg'
import UsdcSvg from 'assets/images/usdc.svg'
import UsdtSvg from 'assets/images/usdt.svg'
import ZrxSvg from 'assets/images/zrx.svg'

const renderErrorMessage = (
  address,
  type,
  message
) => {
  const errorMsg = `Error fetching ${type} for prize pool with address: ${address}: ${message}. (maybe wrong Ethereum network?)`

  console.error(errorMsg)
  poolToast.error(errorMsg)
}

export const PoolUI = (
  props,
) => {
  const router = useRouter()
  const networkName = router.query.networkName
  const prizePool = router.query.prizePoolAddress

  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider
  const usersAddress = walletContext._onboard.getState().address

  const [ethBalance, setEthBalance] = useState(ethers.utils.bigNumberify(0))
  const [poolAddresses, setPoolAddresses] = useState({
    prizePool
  })
  const [genericChainValues, setGenericChainValues] = useState({
    loading: true,
    tokenSymbol: 'TOKEN',
    poolTotalSupply: '1234',
  })

  const [usersChainValues, setUsersChainValues] = useState({
    loading: true,
    usersTicketBalance: ethers.utils.bigNumberify(0),
    usersTokenAllowance: ethers.utils.bigNumberify(0),
    usersTokenBalance: ethers.utils.bigNumberify(0),
  })

  useInterval(() => {
    fetchChainData(
      networkName,
      usersAddress,
      poolAddresses,
      setPoolAddresses,
      setGenericChainValues,
      setUsersChainValues,
    )
  }, 7777)

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
    const balance = walletContext.state.onboard.getState().balance
    if (balance) {
      setEthBalance(ethers.utils.bigNumberify(balance))
    }
  }, [walletContext])

  if (poolAddresses.error || genericChainValues.error || usersChainValues.error) {
    if (poolAddresses.error) {
      renderErrorMessage(prizePool, 'pool addresses', poolAddresses.errorMessage)
    }

    if (genericChainValues.error) {
      renderErrorMessage(prizePool, 'generic chain values', genericChainValues.errorMessage)
    }

    if (usersChainValues.error) {
      renderErrorMessage(prizePool, `user's chain values`, usersChainValues.errorMessage)
    }

    // router.push(
    //   `/`,
    //   `/`,
    //   {
    //     shallow: true
    //   }
    // )

    return null
  }


  try {
    ethers.utils.getAddress(prizePool)
  } catch (e) {
    return 'Incorrectly formatted Ethereum address!'
  }

  const handleConnect = (e) => {
    e.preventDefault()

    walletContext.handleConnectWallet()
  }

  const tokenSymbol = genericChainValues.tokenSymbol

  let tokenSvg = DaiSvg
  if (tokenSymbol === 'BAT') {
    tokenSvg = BatSvg
  } else if (tokenSymbol === 'USDC') {
    tokenSvg = UsdcSvg
  } else if (tokenSymbol === 'USDT') {
    tokenSvg = UsdtSvg
  } else if (tokenSymbol === 'USDC') {
    tokenSvg = UsdtSvg
  } else if (tokenSymbol === 'ZRX') {
    tokenSvg = ZrxSvg
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
      <div className='px-4 sm:px-8 lg:px-10 py-4 sm:py-6 text-center rounded-lg'>
        <img
          src={tokenSvg}
          className='inline-block w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mb-2'
        />

        <div
          className='mb-6'
        >
          Prize Pool contract address:
          <br /> <EtherscanAddressLink
            address={poolAddresses.prizePool}
            networkName={networkName}
          >
            {poolAddresses.prizePool}
          </EtherscanAddressLink>
        </div>

        <PoolActionsUI
          genericChainValues={genericChainValues}
          networkName={networkName}
          poolAddresses={poolAddresses}
          usersAddress={usersAddress}
        />
      </div>

      <hr />

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
              className='mt-3 sm:mt-5 mb-5'
            >
              <button
                className='font-bold rounded-full text-green-300 border-2 sm:border-4 border-green-300 hover:text-white hover:bg-lightPurple-1000 text-xxs sm:text-base pt-2 pb-2 px-3 sm:px-6 trans'
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
