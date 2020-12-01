import { batch, contract } from '@pooltogether/etherplex'

import ComptrollerAbi from '@pooltogether/pooltogether-contracts/abis/Comptroller'

import { fetchTokenChainData } from 'lib/utils/fetchTokenChainData'
import { readProvider } from 'lib/utils/getReadProvider'

export const fetchBalanceDripChainValues = async (
  networkName,
  provider,
  comptrollerAddress,
  prizeStrategyAddress,
  ticketAddress
) => {
  try {
    const etherplexComptrollerContract = contract('comptroller', ComptrollerAbi, comptrollerAddress)

    const values = await batch(
      provider,
      etherplexComptrollerContract.getActiveBalanceDripTokens(prizeStrategyAddress, ticketAddress)
    )

    const activeBalanceDrips = values.comptroller.getActiveBalanceDripTokens[0]

    let drips = []
    activeBalanceDrips.forEach(async (dripAddress) => {
      try {
        const tokenChainValues = await fetchTokenChainData(
          networkName,
          comptrollerAddress,
          dripAddress
        )

        drips.push({
          id: dripAddress,
          ...tokenChainValues,
        })
      } catch (e) {
        console.error(e)
      }
    })

    return {
      drips,
    }
  } catch (e) {
    console.warn(e.message)
    // console.error(e)
    return {}
  }
}

export const fetchBalanceDripChainData = async (
  networkName,
  comptrollerAddress,
  prizeStrategyAddress,
  ticketAddress
) => {
  const provider = await readProvider(networkName)

  const dripChainValues = await fetchBalanceDripChainValues(
    networkName,
    provider,
    comptrollerAddress,
    prizeStrategyAddress,
    ticketAddress
  )

  return dripChainValues
}
