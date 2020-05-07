import React, { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'

import { Button } from 'lib/components/Button'
import { LoadingDots } from 'lib/components/LoadingDots'
import { PoolActionsUI } from 'lib/components/PoolActionsUI'
import { UserActionsUI } from 'lib/components/UserActionsUI'
import { UserStats } from 'lib/components/UserStats'
import { WalletContext } from 'lib/components/WalletContextProvider'

import { useInterval } from 'lib/hooks/useInterval'
import { getChainValues, getPoolAddresses } from 'lib/utils/fetchChainData'
import { getEthBalance } from 'lib/utils/getEthBalance'

export const PoolUI = (
  props,
) => {
  const router = useRouter()
  const walletContext = useContext(WalletContext)

  const pool = router.query.poolAddress
  try {
    ethers.utils.getAddress(pool)
  } catch (e) {
    return 'Incorrectly formatted Ethereum address!'
  }

  const [ethBalance, setEthBalance] = useState(ethers.utils.bigNumberify(0))
  const [poolAddresses, setPoolAddresses] = useState({
    pool
  })
  const [chainValues, setChainValues] = useState({
    loading: true,
    erc20Symbol: 'TOKEN',
    usersTicketBalance: ethers.utils.bigNumberify(0),
    usersERC20Allowance: ethers.utils.bigNumberify(0),
    usersERC20Balance: ethers.utils.bigNumberify(0),
  })

  useInterval(() => {
    getPoolAddresses(walletContext, poolAddresses, setPoolAddresses)
    getChainValues(walletContext, poolAddresses, setChainValues)
  }, 5000)

  useEffect(() => {
    getPoolAddresses(walletContext, poolAddresses, setPoolAddresses)
    getChainValues(walletContext, poolAddresses, setChainValues)
  }, [walletContext, address, poolAddresses])

  useEffect(() => {
    getEthBalance(walletContext, setEthBalance)
  }, [walletContext])

  const handleConnect = (e) => {
    e.preventDefault()

    walletContext.handleConnectWallet()
  }

  const address = walletContext._onboard.getState().address
  
  return <>
    {address ?
      <>
        {chainValues.loading ?
          <div
            className='text-center text-xl'
          >
            <LoadingDots />
            <br/>
            Fetching chain values ...
          </div>
        : <>
          <div className='bg-lightPurple-800 p-10 text-center rounded-lg'>
            Pool address: {poolAddresses.pool}
            <hr/>
            <PoolActionsUI
              chainValues={chainValues}
              poolAddresses={poolAddresses}
            />
          </div>

          <UserStats
            ethBalance={ethBalance}
            chainValues={chainValues}
          />
          <UserActionsUI
            chainValues={chainValues}
            poolAddresses={poolAddresses}
          />
        </>}
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
