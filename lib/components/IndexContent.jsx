import React, { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'

import { Button } from 'lib/components/Button'
import { Forms } from 'lib/components/Forms'
import { LoadingDots } from 'lib/components/LoadingDots'
import { MainPanel } from 'lib/components/MainPanel'
import { WalletContext } from 'lib/components/WalletContextProvider'

import { useInterval } from 'lib/hooks/useInterval'
import { getChainValues, getPoolAddresses } from 'lib/utils/getChainValues'
import { getEthBalance } from 'lib/utils/getEthBalance'

import PoolIcon from 'assets/images/holidays.svg'

export const IndexContent = (
  props,
) => {
  const walletContext = useContext(WalletContext)

  const [ethBalance, setEthBalance] = useState(ethers.utils.bigNumberify(0))
  const [poolAddresses, setPoolAddresses] = useState({})
  const [chainValues, setChainValues] = useState({
    loading: true,
    erc20Symbol: 'TOKEN',
    usersTicketBalance: ethers.utils.bigNumberify(0),
    usersERC20Allowance: ethers.utils.bigNumberify(0),
    usersERC20Balance: ethers.utils.bigNumberify(0),
  })

  useInterval(() => {
    getPoolAddresses(walletContext, poolAddresses, setPoolAddresses)
    getChainValues(walletContext, poolAddresses, chainValues, setChainValues)
  }, 5000)

  useEffect(() => {
    getPoolAddresses(walletContext, poolAddresses, setPoolAddresses)
    getChainValues(walletContext, poolAddresses, chainValues, setChainValues)
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
    <div
      className='mt-10 mb-10 sm:mb-20 lg:w-2/3'
    >
      <img src={PoolIcon} className='inline-block w-10 h-10 ml-2' />
      <div
        className='text-blue-400 title text-xl sm:text-3xl'
      >
        v3.0 - Reference Pool Frontend
      </div>

      <a
        href='https://docs.pooltogether.com/contracts/prize-pool'
        className='trans'
      >View documentation</a>
    </div>

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
          <MainPanel
            ethBalance={ethBalance}
            chainValues={chainValues}
          />
          <Forms
            chainValues={chainValues}
            {...props}
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
