import React from 'react'
import { useRouter } from 'next/router'

import { usePoolChainValues } from 'lib/hooks/usePoolChainValues'
import { poolToast } from 'lib/utils/poolToast'
import { useNetwork } from 'lib/hooks/useNetwork'
import { usePrizePoolContracts } from 'lib/hooks/usePrizePoolContracts'
import { SUPPORTED_NETWORKS } from 'lib/constants'
import { PoolTogetherLoading } from 'lib/components/PoolTogetherLoading'
import { useExternalErc20Awards } from 'lib/hooks/useExternalErc20Awards'
import { useExternalErc721Awards } from 'lib/hooks/useExternalErc721Awards'
import { useUserChainValues } from 'lib/hooks/useUserChainValues'
import { IncompatibleContractWarning } from 'lib/components/IncompatibleContractWarning'
import { UnsupportedNetwork } from 'lib/components/UnsupportedNetwork'
import { useUsersAddress } from 'lib/hooks/useUsersAddress'

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
  // TODO: invalid address view

  const { chainId, name: networkName } = useNetwork()

  const usersAddress = useUsersAddress()
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
    !prizePoolContractsIsFetched ||
    !externalErc20AwardsIsFetched ||
    !externalErc721AwardsIsFetched ||
    (usersAddress && !usersChainValuesIsFetched)

  if (loading) {
    return <PoolTogetherLoading />
  }

  return (
    <>
      <IncompatibleContractWarning />
      {props.children}
    </>
  )
}
