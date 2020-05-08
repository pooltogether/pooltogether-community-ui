import React, { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'

import { LoadingDots } from 'lib/components/LoadingDots'
import { PoolActionsUI } from 'lib/components/PoolActionsUI'
import { UserActionsUI } from 'lib/components/UserActionsUI'
import { UserStats } from 'lib/components/UserStats'
import { WalletContext } from 'lib/components/WalletContextProvider'

import { useInterval } from 'lib/hooks/useInterval'
import { fetchChainData } from 'lib/utils/fetchChainData'
// import { getEthBalance } from 'lib/utils/getEthBalance'

export const PoolUI = (
  props,
) => {
  const router = useRouter()
  const networkName = router.query.networkName
  const pool = router.query.poolAddress

  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider
  const usersAddress = walletContext._onboard.getState().address

  try {
    ethers.utils.getAddress(pool)
  } catch (e) {
    return 'Incorrectly formatted Ethereum address!'
  }

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

  // useEffect(() => {
  //   getEthBalance(walletContext, setEthBalance)
  // }, [walletContext])

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
      <div className='bg-purple-1000 p-10 text-center rounded-lg'>
        Pool address: {poolAddresses.pool}
        <hr/>
        <PoolActionsUI
          genericChainValues={genericChainValues}
          poolAddresses={poolAddresses}
          usersAddress={usersAddress}
        />
      </div>

      <UserStats
        // ethBalance={ethBalance}
        genericChainValues={genericChainValues}
        usersChainValues={usersChainValues}
      />
      <UserActionsUI
        genericChainValues={genericChainValues}
        poolAddresses={poolAddresses}
        usersChainValues={usersChainValues}
      />
    </>}
  </>
}
