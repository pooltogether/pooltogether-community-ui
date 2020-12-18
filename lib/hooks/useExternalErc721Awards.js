import { useEffect } from 'react'
import { batch, contract } from '@pooltogether/etherplex'
import { atom, useAtom } from 'jotai'
import { useInterval } from 'beautiful-react-hooks'
import PrizeStrategyAbi from '@pooltogether/pooltogether-contracts/abis/PeriodicPrizeStrategy'

import { poolAddressesAtom } from 'lib/hooks/usePoolAddresses'
import { poolChainValuesAtom } from 'lib/hooks/usePoolChainValues'
import { useReadProvider } from 'lib/hooks/useReadProvider'
import { DATA_REFRESH_POLLING_INTERVAL } from 'lib/constants'
import { errorStateAtom, getDataFetchingErrorMessage } from 'lib/components/PoolData'

export const erc721AwardsAtom = atom({
  loading: true,
  awards: []
})

export const useExternalErc721Awards = () => {
  const [poolAddresses] = useAtom(poolAddressesAtom)
  const [poolChainValues] = useAtom(poolChainValuesAtom)
  const [erc721Awards, setErc721Awards] = useAtom(erc721AwardsAtom)
  const [errorState, setErrorState] = useAtom(errorStateAtom)
  const provider = useReadProvider()

  useEffect(() => {
    if (!provider || !poolAddresses.prizePool || !poolChainValues.externalErc721Awards) return

    fetchErc721TokenIds(
      provider,
      poolAddresses.prizeStrategy,
      poolChainValues.externalErc721Awards,
      setErc721Awards,
      setErrorState
    )
  }, [provider, poolAddresses.prizePool, poolChainValues.externalErc721Awards])

  useInterval(() => {
    if (!provider || !poolAddresses.prizePool || !poolChainValues.externalErc721Awards) return

    fetchErc721TokenIds(
      provider,
      poolAddresses.prizeStrategy,
      poolChainValues.externalErc721Awards,
      setErc721Awards,
      setErrorState
    )
  }, DATA_REFRESH_POLLING_INTERVAL)

  return [erc721Awards, setErc721Awards]
}

export const fetchErc721TokenIds = async (
  provider,
  prizeStrategyAddress,
  erc721Addresses,
  setErc721Awards,
  setErrorState
) => {
  const flattenedValues = []
  const batchCalls = []

  let etherplexTokenContract

  if (erc721Addresses?.length === 0) {
    setErc721Awards({
      loading: false,
      awards: []
    })
    return
  }

  console.log('Addresses', erc721Addresses)

  for (const address of erc721Addresses) {
    const prizeStrategyContract = contract(address, PrizeStrategyAbi, prizeStrategyAddress)
    batchCalls.push(prizeStrategyContract.getExternalErc721AwardTokenIds(address))
  }

  console.log('batch calls length', batchCalls.length)

  try {
    const response = await batch(provider, ...batchCalls)

    Object.keys(response).forEach((address) => {
      flattenedValues.push({
        address,
        tokenIds: response[address].getExternalErc721AwardTokenIds
      })
    })
  } catch (e) {
    console.error(e)
    setErrorState({
      error: true,
      errorMessage: getDataFetchingErrorMessage(prizeStrategyAddress, 'erc721 token ids', e.message)
    })
  }

  setErc721Awards({
    loading: false,
    awards: flattenedValues
  })
}
