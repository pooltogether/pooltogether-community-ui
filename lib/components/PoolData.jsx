import React, { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { atom, useAtom } from 'jotai'
import { useRouter } from 'next/router'

import { LoadingDots } from 'lib/components/LoadingDots'
import { usePoolAddresses } from 'lib/hooks/usePoolAddresses'
import { usePoolChainValues } from 'lib/hooks/usePoolChainValues'
import { usePrizePoolType } from 'lib/hooks/usePrizePoolType'
import { useUserChainValues } from 'lib/hooks/useUserChainValues'
import { poolToast } from 'lib/utils/poolToast'
import { useExternalErc20Awards } from 'lib/hooks/useExternalErc20Awards'
import { useNetwork } from 'lib/hooks/useNetwork'
import { useUsersAddress } from 'lib/hooks/useUsersAddress'
import { useCoinGeckoTokenIds } from 'lib/hooks/useCoinGeckoTokenIds'

// http://localhost:3000/pools/rinkeby/0xd1E58Db0d67DB3f28fFa412Db58aCeafA0fEF8fA#admin

export const getDataFetchingErrorMessage = (address, type, message) =>
  `Error fetching ${type} for prize pool with address: ${address}: ${message}. (maybe wrong Ethereum network or your IP is being rate-limited?)`

const renderErrorMessage = (errorMsg) => {
  console.error(errorMsg)
  poolToast.error(errorMsg)
}

// Jotai Atoms
export const errorStateAtom = atom({
  error: null,
  errorMessage: null
})

/**
 * Wraps app and populates Jotai pool data stores if applicable
 */
export const PoolData = (props) => {
  const router = useRouter()
  const { prizePoolAddress } = router.query
  const [errorState] = useAtom(errorStateAtom)

  // If there's no address, we don't need to check it or fetch data
  if (!prizePoolAddress) {
    return props.children
  }

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

  return <PoolDataInitialization>{props.children}</PoolDataInitialization>
}

/**
 * Main wrapper for the data fetching
 */
const PoolDataInitialization = (props) => {
  useNetwork()
  useUsersAddress()
  useCoinGeckoTokenIds()
  usePrizePoolType()
  usePoolAddresses()
  const [poolChainValues, setPoolChainValues] = usePoolChainValues()
  useUserChainValues()
  useExternalErc20Awards()

  if (poolChainValues.loading) {
    return (
      <div className='text-center text-xl'>
        <LoadingDots />
        <br />
        <h1>Fetching chain values ...</h1>
      </div>
    )
  }

  return props.children
}
