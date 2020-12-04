import { useContext, useEffect } from 'react'
import { batch, contract } from '@pooltogether/etherplex'
import { useAtom } from 'jotai'

import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { erc20AwardsAtom, poolAddressesAtom, poolChainValuesAtom } from 'lib/components/PoolUI'
import { WalletContext } from 'lib/components/WalletContextProvider'

import ERC20Abi from 'ERC20Abi'
import { DEFAULT_TOKEN_PRECISION } from 'lib/constants'

export const useExternalErc20Awards = (provider) => {
  const [poolAddresses] = useAtom(poolAddressesAtom)
  const [poolChainValues] = useAtom(poolChainValuesAtom)
  const [erc20Awards, setErc20Awards] = useAtom(erc20AwardsAtom)

  useEffect(() => {
    fetchErc20AwardBalances(
      provider,
      poolAddresses,
      poolChainValues.externalErc20Awards,
      setErc20Awards
    )
  }, [poolAddresses.prizePool, poolChainValues.externalErc20Awards])

  return [erc20Awards, setErc20Awards]
}

export const fetchErc20AwardBalances = async (
  provider,
  poolAddresses,
  erc20Addresses,
  setErc20Awards
) => {
  const batchCalls = []
  const flattenedValues = []

  let etherplexTokenContract
  const { prizePool } = poolAddresses

  if (!erc20Addresses || erc20Addresses?.length === 0) {
    return
  }

  for (const address of erc20Addresses) {
    etherplexTokenContract = contract(address, ERC20Abi, address)
    try {
      const response = await batch(
        provider,
        etherplexTokenContract
          .balanceOf(prizePool)
          .name()
          .symbol()
          .decimals()
      )
      const values = response[address]
      const formattedBalance = displayAmountInEther(values.balanceOf[0], {
        precision: 4,
        decimals: values.decimals?.[0] || DEFAULT_TOKEN_PRECISION
      })
      flattenedValues.push({
        address,
        formattedBalance,
        balance: values.balanceOf[0],
        name: values.name[0],
        decimals: values.decimals?.[0] || DEFAULT_TOKEN_PRECISION,
        symbol: values.symbol[0]
      })
    } catch (e) {
      console.warn(e.message)
    }
  }
  setErc20Awards(flattenedValues)
}
