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
import { DATA_REFRESH_POLLING_INTERVAL } from 'lib/constants'
import { useReadProvider } from 'lib/hooks/useReadProvider'
import { ThemeContext } from 'lib/components/contextProviders/ThemeContextProvider'
import { MainUI } from 'lib/components/MainUI'
import { getCoinGeckoId, getCoinGeckoTokenList } from 'lib/services/coingecko'

// http://localhost:3000/pools/rinkeby/0xd1E58Db0d67DB3f28fFa412Db58aCeafA0fEF8fA#admin

export const getDataFetchingErrorMessage = (address, type, message) =>
  `Error fetching ${type} for prize pool with address: ${address}: ${message}. (maybe wrong Ethereum network or your IP is being rate-limited?)`

const renderErrorMessage = (errorMsg) => {
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

export const errorStateAtom = atom({
  error: null,
  errorMessage: null
})

export const coinGeckoTokenIdsAtom = atom({})

/**
 * Main wrapper for the UI views
 */
const PoolUIViews = (props) => {
  const router = useRouter()
  const networkName = router.query.networkName
  const prizePool = router.query.prizePoolAddress

  const [errorState] = useAtom(errorStateAtom)

  const walletContext = useContext(WalletContext)
  console.log(walletContext)
  const provider = walletContext.state.provider
  const usersAddress = walletContext._onboard.getState().address

  const [ethBalance, setEthBalance] = useAtom(ethBalanceAtom)
  const [_usersAddress, setUsersAddress] = useAtom(usersAddressAtom)
  const [network, setNetwork] = useAtom(networkAtom)
  const [coinGeckoTokenIds, setCoinGeckoTokenIds] = useAtom(coinGeckoTokenIdsAtom)

  const readProvider = useReadProvider(networkName)
  const [poolAddresses, setPoolAddresses] = usePoolAddresses(readProvider)
  const [userChainValues, setUserChainValues] = useUserChainValues(readProvider)
  const [prizePoolType, setPrizePoolType] = usePrizePoolType(readProvider)
  const [poolChainValues, setPoolChainValues] = usePoolChainValues(readProvider)
  const [erc20Awards, setErc20Awards] = useExternalErc20Awards(readProvider)

  // Fetch CoinGecko Token Ids so we can map token symbol + name to images
  useEffect(() => {
    const getTokenData = async () => {
      try {
        const response = await getCoinGeckoTokenList()
        const tokenIds = {
          _error: false
        }
        response.data.forEach((token) => {
          tokenIds[getCoinGeckoId(token)] = token.id
        })
        setCoinGeckoTokenIds(tokenIds)
        console.log(tokenIds)
      } catch (e) {
        console.log("Can't access CoinGecko Token Data")
        setCoinGeckoTokenIds({
          _error: true
        })
      }
    }

    getTokenData()
  }, [])

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
    fetchPoolChainValues(readProvider, poolAddresses, prizePoolType, setPoolChainValues)
    fetchUserChainData(readProvider, poolAddresses, usersAddress, setUserChainValues)
    fetchErc20AwardBalances(
      readProvider,
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

  if (poolChainValues.loading) {
    return <div className='text-center text-xl'>
    <LoadingDots />
    <br />
    Fetching chain values ...
  </div>
  }
  
  return (
    <>
      {poolChainValues.loading ? (
        
      ) : (
        <MainUI />
      )}
    </>
  )
}

export const PoolUI = (props) => {
  const router = useRouter()
  const networkName = router.query.networkName
  const prizePoolAddress = router.query.prizePoolAddress
  const [errorState] = useAtom(errorStateAtom)

  try {
    ethers.utils.getAddress(String(prizePoolAddress))
  } catch (e) {
    throw new Error(`Incorrectly formatted Ethereum address! ${prizePoolAddress}`)
  }

  // Error Catching
  if (errorState.error) {
    if (errorState.errorMessage) {
      renderErrorMessage(errorState.errorMessage)
    }
    return null
  }

  return <PoolUIViews />
}

// const changeHash = (hash) => {
//   setIsSelected(hash)

//   router.push(`${router.route.split('#')[0]}${hash}`, `${router.asPath.split('#')[0]}${hash}`, {
//     shallow: true
//   })
// }