import React, { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { atom, useAtom } from 'jotai'
import { useRouter } from 'next/router'

import { AdminUI } from 'lib/components/AdminUI'
import { EtherscanAddressLink } from 'lib/components/EtherscanAddressLink'
import { InteractUI } from 'lib/components/InteractUI'
import { LoadingDots } from 'lib/components/LoadingDots'
import { StatsUI } from 'lib/components/StatsUI'
import { Content, ContentPane, Tab, Tabs } from 'lib/components/Tabs'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { useInterval } from 'lib/hooks/useInterval'
import { usePoolAddresses } from 'lib/hooks/usePoolAddresses'
import { fetchPoolChainValues, usePoolChainValues } from 'lib/hooks/usePoolChainValues'
import { usePrizePoolType } from 'lib/hooks/usePrizePoolType'
import { fetchUserChainData, useUserChainValues } from 'lib/hooks/useUserChainValues'
import { nameToChainId } from 'lib/utils/nameToChainId'
import { poolToast } from 'lib/utils/poolToast'
import { fetchErc20AwardBalances, useExternalErc20Awards } from 'lib/hooks/useExternalErc20Awards'
import BatSvg from 'assets/images/bat-new-transparent.png'
import DaiSvg from 'assets/images/dai-new-transparent.png'
import UsdcSvg from 'assets/images/usdc-new-transparent.png'
import UsdtSvg from 'assets/images/usdt-new-transparent.png'
import WbtcSvg from 'assets/images/wbtc-new-transparent.png'
import ZrxSvg from 'assets/images/zrx-new-transparent.png'
import { DATA_REFRESH_POLLING_INTERVAL } from 'lib/constants'

// http://localhost:3000/pools/rinkeby/0xd1E58Db0d67DB3f28fFa412Db58aCeafA0fEF8fA#admin

const renderErrorMessage = (address, type, message) => {
  const errorMsg = `Error fetching ${type} for prize pool with address: ${address}: ${message}. (maybe wrong Ethereum network or your IP is being rate-limited?)`

  console.error(errorMsg)
  poolToast.error(errorMsg)
}

// Jotai Atoms
export const ethBalanceAtom = atom(ethers.utils.bigNumberify(0))
export const erc20AwardsAtom = atom([])
export const prizePoolTypeAtom = atom('')
export const poolAddressesAtom = atom({})
export const usersAddressAtom = atom('')
export const networkAtom = atom({})
export const poolChainValuesAtom = atom({
  loading: true
})
export const userChainValuesAtom = atom({
  loading: true,
  usersTicketBalance: ethers.utils.bigNumberify(0),
  usersTokenAllowance: ethers.utils.bigNumberify(0),
  usersTokenBalance: ethers.utils.bigNumberify(0)
})

/**
 * Main wrapper for the UI views
 */
export const PoolUI = (props) => {
  const router = useRouter()
  const networkName = router.query.networkName
  const prizePool = router.query.prizePoolAddress

  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider
  const usersAddress = walletContext._onboard.getState().address

  const [ethBalance, setEthBalance] = useAtom(ethBalanceAtom)
  const [_usersAddress, setUsersAddress] = useAtom(usersAddressAtom)
  const [network, setNetwork] = useAtom(networkAtom)

  const [poolAddresses, setPoolAddresses] = usePoolAddresses()
  const [userChainValues, setUserChainValues] = useUserChainValues()
  const [prizePoolType, setPrizePoolType] = usePrizePoolType()
  const [poolChainValues, setPoolChainValues] = usePoolChainValues()
  const [erc20Awards, setErc20Awards] = useExternalErc20Awards()

  useEffect(() => {
    setPoolAddresses({
      prizePool
    })

    return () => {
      setPoolAddresses({})
      setErc20Awards([])
      setUserChainValues({
        loading: true,
        usersTicketBalance: ethers.utils.bigNumberify(0),
        usersTokenAllowance: ethers.utils.bigNumberify(0),
        usersTokenBalance: ethers.utils.bigNumberify(0)
      })
      setPrizePoolType('')
      setPoolChainValues({
        loading: true
      })
    }
  }, [])

  useEffect(() => {
    setUsersAddress(usersAddress)
  }, [usersAddress])

  useEffect(() => {
    setNetwork({
      name: networkName,
      id: nameToChainId(networkName)
    })
  }, [networkName])

  // Keep chain values fresh
  useInterval(() => {
    fetchPoolChainValues(provider, poolAddresses, prizePoolType, setPoolChainValues)
    fetchUserChainData(provider, poolAddresses, usersAddress, setUserChainValues)
    fetchErc20AwardBalances(
      provider,
      poolAddresses,
      poolChainValues.externalErc20Awards,
      setErc20Awards
    )
  }, DATA_REFRESH_POLLING_INTERVAL)

  useEffect(() => {
    const balance = walletContext.state.onboard.getState().balance
    if (balance) {
      setEthBalance(ethers.utils.bigNumberify(balance))
    }
  }, [walletContext])

  const [isSelected, setIsSelected] = useState('#stats')

  useEffect(() => {
    if (window.location.hash) {
      setIsSelected(window.location.hash)
    }
  }, [])

  const changeHash = (hash) => {
    setIsSelected(hash)

    router.push(`${router.route.split('#')[0]}${hash}`, `${router.asPath.split('#')[0]}${hash}`, {
      shallow: true
    })
  }

  if (poolAddresses.error || poolChainValues.error || userChainValues.error || erc20Awards.error) {
    if (poolAddresses.error) {
      renderErrorMessage(prizePool, 'pool addresses', poolAddresses.errorMessage)
    }

    if (poolChainValues.error) {
      renderErrorMessage(prizePool, 'generic chain values', poolChainValues.errorMessage)
    }

    if (userChainValues.error) {
      renderErrorMessage(prizePool, `user's chain values`, userChainValues.errorMessage)
    }

    if (erc20Awards.error) {
      renderErrorMessage(prizePool, 'erc20 awards', erc20Awards.errorMessage)
    }

    return null
  }

  try {
    ethers.utils.getAddress(prizePool)
  } catch (e) {
    return <>'Incorrectly formatted Ethereum address!'</>
  }

  const handleConnect = (e) => {
    e.preventDefault()

    walletContext.handleConnectWallet()
  }

  const tokenSymbol = poolChainValues.tokenSymbol

  let tokenSvg
  if (tokenSymbol === 'DAI') {
    tokenSvg = DaiSvg
  } else if (tokenSymbol === 'BAT') {
    tokenSvg = BatSvg
  } else if (tokenSymbol === 'USDC') {
    tokenSvg = UsdcSvg
  } else if (tokenSymbol === 'USDT') {
    tokenSvg = UsdtSvg
  } else if (tokenSymbol === 'USDC') {
    tokenSvg = UsdtSvg
  } else if (tokenSymbol === 'WBTC') {
    tokenSvg = WbtcSvg
  } else if (tokenSymbol === 'ZRX') {
    tokenSvg = ZrxSvg
  }

  return (
    <>
      {poolChainValues.loading ? (
        <div className='text-center text-xl'>
          <LoadingDots />
          <br />
          Fetching chain values ...
        </div>
      ) : (
        <>
          <div className='py-4 sm:py-6 text-center'>
            <img
              src={tokenSvg}
              className='inline-block w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mb-2'
            />

            <div className='mb-6'>
              Prize Pool contract address:
              <br />{' '}
              <EtherscanAddressLink address={poolAddresses.prizePool} networkName={networkName}>
                {poolAddresses.prizePool}
              </EtherscanAddressLink>
            </div>
          </div>

          <div className='mt-8'>
            <Tabs>
              <Tab changeHash={changeHash} selected={isSelected === '#stats'} hash='#stats'>
                Stats
              </Tab>
              <Tab changeHash={changeHash} selected={isSelected === '#interact'} hash='#interact'>
                Interact
              </Tab>
              <Tab changeHash={changeHash} selected={isSelected === '#admin'} hash='#admin'>
                Admin
              </Tab>
            </Tabs>

            <Content>
              <ContentPane isSelected={isSelected === '#stats'}>
                <StatsUI
                  poolChainValues={poolChainValues}
                  networkName={networkName}
                  poolAddresses={poolAddresses}
                  usersAddress={usersAddress}
                />
              </ContentPane>

              <ContentPane isSelected={isSelected === '#interact'}>
                <InteractUI
                  poolChainValues={poolChainValues}
                  poolAddresses={poolAddresses}
                  usersChainValues={userChainValues}
                />
              </ContentPane>

              <ContentPane isSelected={isSelected === '#admin'}>
                <AdminUI poolChainValues={poolChainValues} poolAddresses={poolAddresses} />
              </ContentPane>
            </Content>
          </div>
        </>
      )}
    </>
  )
}
