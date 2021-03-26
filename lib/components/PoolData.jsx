import React from 'react'
import classnames from 'classnames'
import { useAtom } from 'jotai'
import { useRouter } from 'next/router'
import FeatherIcon from 'feather-icons-react'

import { usePoolChainValues } from 'lib/hooks/usePoolChainValues'
import { poolToast } from 'lib/utils/poolToast'
import { useNetwork } from 'lib/hooks/useNetwork'
import { usePrizePoolContracts } from 'lib/hooks/usePrizePoolContracts'
import { SUPPORTED_NETWORKS } from 'lib/constants'
import { chainIdToName, networkColorClassname } from 'lib/utils/networks'
import { PoolTogetherLoading } from 'lib/components/PoolTogetherLoading'
import { errorStateAtom } from 'lib/atoms'
import { useExternalErc20Awards } from 'lib/hooks/useExternalErc20Awards'
import { useExternalErc721Awards } from 'lib/hooks/useExternalErc721Awards'
import { useUserChainValues } from 'lib/hooks/useUserChainValues'

// http://localhost:3000/pools/rinkeby/0xd1E58Db0d67DB3f28fFa412Db58aCeafA0fEF8fA#admin

export const getDataFetchingErrorMessage = (address, type, message) =>
  `Error fetching ${type} for prize pool with address: ${address}: ${message}. (maybe wrong Ethereum network or your IP is being rate-limited?)`

const renderErrorMessage = (errorMsg) => {
  console.error(errorMsg)
  poolToast.error(errorMsg)
}

/**
 * Wraps app and populates Jotai pool data stores if applicable
 */
export const PoolData = (props) => {
  const router = useRouter()
  const { poolAlias, prizePoolAddress } = router.query

  const { chainId, name: networkName } = useNetwork()
  const [errorState] = useAtom(errorStateAtom)

  const { isFetched: poolChainValuesIsFetched } = usePoolChainValues()
  const { isFetched: usersChainValuesIsFetched } = useUserChainValues()
  const { isFetched: prizePoolContractsIsFetched } = usePrizePoolContracts()
  const { isFetched: externalErc20AwardsIsFetched } = useExternalErc20Awards()
  const { isFetched: externalErc721AwardsIsFetched } = useExternalErc721Awards()

  if (!SUPPORTED_NETWORKS.includes(chainId)) {
    return <UnsupportedNetwork chainId={chainId} networkName={networkName} />
  }

  const loading =
    !poolChainValuesIsFetched ||
    !usersChainValuesIsFetched ||
    !prizePoolContractsIsFetched ||
    !externalErc20AwardsIsFetched ||
    !externalErc721AwardsIsFetched
  if (loading) {
    return <PoolTogetherLoading />
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
