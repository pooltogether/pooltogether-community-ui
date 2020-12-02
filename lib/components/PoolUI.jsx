// http://localhost:3000/pools/rinkeby/0xd1E58Db0d67DB3f28fFa412Db58aCeafA0fEF8fA#admin

import React, { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { atom, useAtom } from 'jotai'

import { AdminUI } from 'lib/components/AdminUI'
import { FormLockedOverlay } from 'lib/components/FormLockedOverlay'
import { EtherscanAddressLink } from 'lib/components/EtherscanAddressLink'
import { LoadingDots } from 'lib/components/LoadingDots'
import { Content, ContentPane, Tabs, Tab } from 'lib/components/Tabs'
import { InteractUI } from 'lib/components/InteractUI'
import { StatsUI } from 'lib/components/StatsUI'
import { UserActionsUI } from 'lib/components/UserActionsUI'
import { UserStats } from 'lib/components/UserStats'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { useInterval } from 'lib/hooks/useInterval'
import { fetchChainData, fetchErc20AwardBalances } from 'lib/utils/fetchChainData'
import { poolToast } from 'lib/utils/poolToast'

import BatSvg from 'assets/images/bat-new-transparent.png'
import DaiSvg from 'assets/images/dai-new-transparent.png'
import UsdcSvg from 'assets/images/usdc-new-transparent.png'
import UsdtSvg from 'assets/images/usdt-new-transparent.png'
import WbtcSvg from 'assets/images/wbtc-new-transparent.png'
import ZrxSvg from 'assets/images/zrx-new-transparent.png'
import { useFetchPoolAddresses } from 'lib/hooks/usePoolAddresses'
import { usePrizePoolType } from 'lib/hooks/usePrizePoolType'
import { nameToChainId } from 'lib/utils/nameToChainId'

const renderErrorMessage = (address, type, message) => {
  const errorMsg = `Error fetching ${type} for prize pool with address: ${address}: ${message}. (maybe wrong Ethereum network or your IP is being rate-limited?)`

  console.error(errorMsg)
  poolToast.error(errorMsg)
}

// Jotai Atoms
export const erc20AwardsAtom = atom([])
export const prizePoolTypeAtom = atom('')
export const poolAddressesAtom = atom({})
export const networkAtom = atom({})

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

  const [ethBalance, setEthBalance] = useState(ethers.utils.bigNumberify(0))
  const [genericChainValues, setGenericChainValues] = useState({
    loading: true,
    tokenSymbol: 'TOKEN',
    poolTotalSupply: '1234'
  })

  const [usersChainValues, setUsersChainValues] = useState({
    loading: true,
    usersTicketBalance: ethers.utils.bigNumberify(0),
    usersTokenAllowance: ethers.utils.bigNumberify(0),
    usersTokenBalance: ethers.utils.bigNumberify(0)
  })

  const [poolAddresses, setPoolAddresses] = useAtom(poolAddressesAtom)
  const [erc20Awards, setErc20Awards] = useAtom(erc20AwardsAtom)
  const [network, setNetwork] = useAtom(networkAtom)

  useEffect(() => {
    // TODO: Probably need to reset other atoms if this changes.
    setPoolAddresses({
      prizePool
    })
  }, [prizePool])

  useEffect(() => {
    setNetwork({
      name: networkName,
      id: nameToChainId(networkName)
    })
  }, [networkName])

  usePrizePoolType()
  useFetchPoolAddresses()

  useEffect(() => {
    const getExternalAwards = async () => {
      if (genericChainValues.externalErc20Awards?.length >= 1) {
        const erc20Awards = await fetchErc20AwardBalances(
          networkName,
          poolAddresses.prizePool,
          genericChainValues.externalErc20Awards
        )
        setErc20Awards(erc20Awards)
      }
    }

    getExternalAwards()
  }, [poolAddresses.prizePool, genericChainValues.externalErc20Awards])

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
    return <>'Incorrectly formatted Ethereum address!'</>
  }

  const handleConnect = (e) => {
    e.preventDefault()

    walletContext.handleConnectWallet()
  }

  const tokenSymbol = genericChainValues.tokenSymbol

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
      {genericChainValues.loading ? (
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
                  genericChainValues={genericChainValues}
                  networkName={networkName}
                  poolAddresses={poolAddresses}
                  usersAddress={usersAddress}
                />
              </ContentPane>

              <ContentPane isSelected={isSelected === '#interact'}>
                <InteractUI
                  genericChainValues={genericChainValues}
                  poolAddresses={poolAddresses}
                  usersChainValues={usersChainValues}
                />
              </ContentPane>

              <ContentPane isSelected={isSelected === '#admin'}>
                <AdminUI genericChainValues={genericChainValues} poolAddresses={poolAddresses} />
              </ContentPane>
            </Content>
          </div>
          {/* 
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
      </div> */}
        </>
      )}
    </>
  )
}
