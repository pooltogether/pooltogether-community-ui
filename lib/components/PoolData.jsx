import React from 'react'
import classnames from 'classnames'
import { ethers } from 'ethers'
import { atom, useAtom } from 'jotai'
import { useRouter } from 'next/router'
import FeatherIcon from 'feather-icons-react'

import { LoadingDots } from 'lib/components/LoadingDots'
import { usePoolAddresses } from 'lib/hooks/usePoolAddresses'
import { usePoolChainValues } from 'lib/hooks/usePoolChainValues'
import { useUserChainValues } from 'lib/hooks/useUserChainValues'
import { poolToast } from 'lib/utils/poolToast'
import { useExternalErc20Awards } from 'lib/hooks/useExternalErc20Awards'
import { useNetwork } from 'lib/hooks/useNetwork'
import { useUsersAddress } from 'lib/hooks/useUsersAddress'
import { useExternalErc721Awards } from 'lib/hooks/useExternalErc721Awards'
import { useDetermineContractVersions } from 'lib/hooks/useDetermineContractVersions'
import { SUPPORTED_NETWORKS } from 'lib/constants'
import { chainIdToName } from 'lib/utils/chainIdToName'
import { networkColorClassname } from 'lib/utils/networkColorClassname'
import { PoolTogetherLoading } from 'lib/components/PoolTogetherLoading'

// http://localhost:3000/pools/rinkeby/0xd1E58Db0d67DB3f28fFa412Db58aCeafA0fEF8fA#admin

export const getDataFetchingErrorMessage = (address, type, message) =>
  `Error fetching ${type} for prize pool with address: ${address}: ${message}. (maybe wrong Ethereum network or your IP is being rate-limited?)`

const renderErrorMessage = (errorMsg) => {
  console.error(errorMsg)
  poolToast.error(errorMsg)
}

// Jotai Atoms
export const errorStateAtom = atom({})

/**
 * Wraps app and populates Jotai pool data stores if applicable
 */
export const PoolData = (props) => {
  const router = useRouter()
  const { poolAlias, prizePoolAddress } = router.query

  const [chainId, networkName] = useNetwork()
  const [errorState] = useAtom(errorStateAtom)

  if (!SUPPORTED_NETWORKS.includes(chainId)) {
    return <UnsupportedNetwork chainId={chainId} networkName={networkName} />
  }

  // If there's no address, we don't need to check it or fetch data
  if (!poolAlias && !prizePoolAddress) {
    return props.children
  }

  if (prizePoolAddress) {
    try {
      ethers.utils.getAddress(String(prizePoolAddress))
    } catch (e) {
      poolToast.error(`Incorrect pool address for path: ${window.location.pathname}`)
      throw new Error(`Incorrectly formatted Ethereum address for GET path entered`)
    }
  }

  // Error Catching
  if (errorState.error) {
    if (errorState.errorMessage) {
      renderErrorMessage(errorState.errorMessage)
    }
  }

  return (
    <PoolDataInitialization>
      {errorState.view}
      {props.children}
    </PoolDataInitialization>
  )
}

/**
 * Main wrapper for the data fetching
 */
const PoolDataInitialization = (props) => {
  useDetermineContractVersions()
  useUsersAddress()
  usePoolAddresses()
  const [poolChainValues] = usePoolChainValues()
  useUserChainValues()
  useExternalErc20Awards()
  useExternalErc721Awards()

  const [errorState] = useAtom(errorStateAtom)

  if (poolChainValues.loading) {
    return (
      <>
        <div className='text-center text-xl'>{errorState.view}</div>
        <PoolTogetherLoading />
      </>
    )
  }

  return props.children
}

const UnsupportedNetwork = (props) => {
  const { chainId, networkName } = props
  return (
    <div className='flex flex-col'>
      <div className='flex mb-8'>
        <FeatherIcon
          icon='alert-triangle'
          className='mr-4 my-auto w-6 h-6 sm:w-8 sm:h-8 text-orange-500'
        />
        <h1>Unsupported network</h1>
        <FeatherIcon
          icon='alert-triangle'
          className='ml-4 my-auto w-6 h-6 sm:w-8 sm:h-8 text-orange-500'
        />
      </div>
      <div>
        You're currently connected to <Network name={networkName} chainId={chainId} />.
      </div>
      <div className='mb-4'>
        Please connect your wallet to one of the following supported networks:
      </div>
      <ul>
        {SUPPORTED_NETWORKS.map((network) => {
          if ([31337, 1234].includes(network)) return null
          return (
            <li className='ml-2 xs:ml-4' key={network}>
              <Network chainId={network} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

const Network = (props) => (
  <span className={classnames('capitalize', networkColorClassname(props.chainId))}>
    <b>{chainIdToName(props.chainId)}</b>
    <small className='ml-1'>{`network id: ${props.chainId}`}</small>
  </span>
)
