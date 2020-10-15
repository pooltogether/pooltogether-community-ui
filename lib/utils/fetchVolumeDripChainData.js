import { batch, contract } from '@pooltogether/etherplex'

import ComptrollerAbi from '@pooltogether/pooltogether-contracts/abis/Comptroller'

import { fetchTokenChainData } from 'lib/utils/fetchTokenChainData'
import { readProvider } from 'lib/utils/getReadProvider'

const fetchTokenForDrip = async (
  array,
  networkName,
  comptrollerAddress,
  dripAddress,
) => {
  try {
    const tokenChainValues = await fetchTokenChainData(
      networkName,
      comptrollerAddress,
      dripAddress,
    )

    array.push({
      id: dripAddress,
      ...tokenChainValues,
    })
  } catch (e) {
    console.error(e)
  }
}

export const fetchVolumeDripChainValues = async (
  networkName,
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
   
    const etherplexComptrollerForReferralVolumeDripsContract = contract(
      'comptrollerForReferralVolumeDrips',
      ComptrollerAbi,
      comptrollerAddress
    )

    let isReferrer = true
    const values = await batch(
      provider,
      etherplexComptrollerContract
        .getActiveVolumeDripTokens(prizeStrategyAddress, ticketAddress, !isReferrer),
      etherplexComptrollerForReferralVolumeDripsContract
        .getActiveVolumeDripTokens(prizeStrategyAddress, ticketAddress, isReferrer)
    )

    console.log({ values})

    const activeVolumeDrips = values.comptroller.getActiveVolumeDripTokens[0]
    const activeReferralVolumeDrips = values.comptrollerForReferralVolumeDrips.getActiveVolumeDripTokens[0]

    console.log({ activeVolumeDrips})
    console.log({ activeReferralVolumeDrips})

    let drips = []
    activeVolumeDrips.forEach(async (dripAddress) => fetchTokenForDrip(
      drips,
      networkName,
      comptrollerAddress,
      dripAddress,
    ))
    
    let referralDrips = []
    activeReferralVolumeDrips.forEach(async (dripAddress) => fetchTokenForDrip(
      referralDrips,
      networkName,
      comptrollerAddress,
      dripAddress,
    ))

    console.log({ drips})
    console.log({ referralDrips})

    return {
      drips,
      referralDrips,
    }
  } catch (e) {
    console.warn(e.message)
    // console.error(e)
    return {}
  }
}

export const fetchVolumeDripChainData = async (
  networkName,
  comptrollerAddress,
  prizeStrategyAddress,
  ticketAddress,
) => {
  const provider = await readProvider(networkName)

  const dripChainValues = await fetchVolumeDripChainValues(
    networkName,
    provider,
    comptrollerAddress,
    prizeStrategyAddress,
    ticketAddress,
  )

  return dripChainValues
}
