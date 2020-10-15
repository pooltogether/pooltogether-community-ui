import { batch, contract } from '@pooltogether/etherplex'

import ComptrollerAbi from '@pooltogether/pooltogether-contracts/abis/Comptroller'

import { readProvider } from 'lib/utils/getReadProvider'

export const fetchDripChainValues = async (
  provider,
  comptrollerAddress,
  prizeStrategyAddress,
  ticketAddress,
) => {
  try {
    const etherplexComptrollerContract = contract(
      'comptroller',
      ComptrollerAbi,
      comptrollerAddress
    )

    console.log({ comptrollerAddress})
    console.log({ prizeStrategyAddress})
    console.log({ ticketAddress})

    const values = await batch(
      provider,
      etherplexComptrollerContract
        .getActiveBalanceDripTokens(prizeStrategyAddress, ticketAddress)
    )

    console.log(values)

    return {
      drips: values.comptroller.getActiveBalanceDripTokens[0],
    }
  } catch (e) {
    console.warn(e.message)
    // console.error(e)
    return {}
  }
}

export const fetchDripChainData = async (
  networkName,
  comptrollerAddress,
  prizeStrategyAddress,
  ticketAddress,
) => {
  const provider = await readProvider(networkName)

  const dripChainValues = await fetchDripChainValues(
    provider,
    comptrollerAddress,
    prizeStrategyAddress,
    ticketAddress,
  )
  console.log('hi', prizeStrategyAddress)
  
  return dripChainValues
}
