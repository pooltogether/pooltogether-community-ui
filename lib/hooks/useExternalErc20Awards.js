import { useEffect } from 'react'
import { batch, contract } from '@pooltogether/etherplex'
import { atom, useAtom } from 'jotai'
import { useInterval } from 'beautiful-react-hooks'

import { DATA_REFRESH_POLLING_INTERVAL, DEFAULT_TOKEN_PRECISION } from 'lib/constants'
import { poolAddressesAtom } from 'lib/hooks/usePoolAddresses'
import { poolChainValuesAtom } from 'lib/hooks/usePoolChainValues'
import { useReadProvider } from 'lib/hooks/useReadProvider'
import { amountWithCommas } from 'lib/utils/format'

import ERC20Abi from 'ERC20Abi'

export const erc20AwardsAtom = atom({
  loading: true,
  awards: []
})

export const useExternalErc20Awards = () => {
  const [poolAddresses] = useAtom(poolAddressesAtom)
  const [poolChainValues] = useAtom(poolChainValuesAtom)
  const [erc20Awards, setErc20Awards] = useAtom(erc20AwardsAtom)
  const { readProvider: provider, isLoaded: readProviderLoaded } = useReadProvider()

  useEffect(() => {
    if (!readProviderLoaded || !poolAddresses.prizePool || !poolChainValues.externalErc20Awards)
      return

    fetchErc20AwardBalances(
      provider,
      poolAddresses.prizePool,
      poolChainValues.externalErc20Awards,
      setErc20Awards
    )
  }, [readProviderLoaded, provider, poolAddresses.prizePool, poolChainValues.externalErc20Awards])

  useInterval(() => {
    if (!readProviderLoaded || !poolAddresses.prizePool || !poolChainValues.externalErc20Awards)
      return

    fetchErc20AwardBalances(
      provider,
      poolAddresses.prizePool,
      poolChainValues.externalErc20Awards,
      setErc20Awards
    )
  }, DATA_REFRESH_POLLING_INTERVAL)

  return [erc20Awards, setErc20Awards]
}

export const fetchErc20AwardBalances = async (
  provider,
  prizePool,
  erc20Addresses,
  setErc20Awards
) => {
  const flattenedValues = []

  let etherplexTokenContract

  if (erc20Addresses?.length === 0) {
    setErc20Awards({
      loading: false,
      awards: []
    })
    return
  }

  for (const address of erc20Addresses) {
    etherplexTokenContract = contract(address, ERC20Abi, address)
    try {
      const response = await batch(
        provider,
        etherplexTokenContract.balanceOf(prizePool).name().symbol().decimals()
      )
      const values = response[address]

      const decimals = values.decimals?.[0] || DEFAULT_TOKEN_PRECISION
      const formattedBalance = amountWithCommas(values.balanceOf[0], decimals)

      flattenedValues.push({
        address,
        formattedBalance,
        decimals,
        symbol: values.symbol[0],
        balance: values.balanceOf[0],
        name: values.name[0]
      })
    } catch (e) {
      console.warn(e.message)
    }
  }

  setErc20Awards({
    loading: false,
    awards: flattenedValues
  })
}
