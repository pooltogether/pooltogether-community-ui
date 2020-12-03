import { batch, contract } from '@pooltogether/etherplex'

import ERC20Abi from 'ERC20Abi'

import { readProvider } from 'lib/utils/getReadProvider'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { useContext, useEffect } from 'react'
import { useAtom } from 'jotai'
import { erc20AwardsAtom, poolAddressesAtom, poolChainValuesAtom } from 'lib/components/PoolUI'
import { WalletContext } from 'lib/components/WalletContextProvider'

export const useExternalErc20Awards = () => {
  const [poolAddresses, setPoolAddresses] = useAtom(poolAddressesAtom)
  const [poolChainValues, setPoolChainValues] = useAtom(poolChainValuesAtom)
  const [erc20Awards, setErc20Awards] = useAtom(erc20AwardsAtom)

  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider

  useEffect(() => {
    fetchErc20AwardBalances(
      provider,
      poolAddresses,
      poolChainValues.externalErc20Awards,
      setErc20Awards
    )
  }, [poolAddresses.prizePool, poolChainValues.externalErc20Awards])
}

export const fetchErc20AwardBalances = async (
  provider,
  poolAddresses,
  erc20Addresses,
  setErc20Awards
) => {
  const batchCalls = []
  let etherplexTokenContract
  const { prizePool } = poolAddresses

  if (!erc20Addresses || erc20Addresses?.length === 0) {
    return
  }

  try {
    // Prepare batched calls
    for (const address of erc20Addresses) {
      etherplexTokenContract = contract(address, ERC20Abi, address)
      batchCalls.push(
        etherplexTokenContract
          .balanceOf(prizePool)
          .name()
          .symbol()
          .decimals()
      )
    }

    const values = await batch(provider, ...batchCalls)
    const flattenedValues = []

    for (const [address, value] of Object.entries(values)) {
      const formattedBalance = displayAmountInEther(value.balanceOf[0], {
        precision: 4,
        decimals: value.decimals[0]
      })

      flattenedValues.push({
        address,
        formattedBalance,
        balance: value.balanceOf[0],
        name: value.name[0],
        decimals: value.decimals[0],
        symbol: value.symbol[0]
      })
    }

    setErc20Awards(flattenedValues)
  } catch (e) {
    setErc20Awards({
      error: true,
      errorMessage: e.message
    })

    console.warn(e.message)
    // console.error(e)
  }
}
