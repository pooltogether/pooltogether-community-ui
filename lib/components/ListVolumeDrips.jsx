import React, { useContext, useEffect, useState } from 'react'
import ComptrollerAbi from '@pooltogether/pooltogether-contracts/abis/Comptroller'
import { ethers } from 'ethers'
import FeatherIcon from 'feather-icons-react'
import { useRouter } from 'next/router'

import { LoadingDots } from 'lib/components/LoadingDots'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { SENTINEL_ADDRESS } from 'lib/constants'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { extractPrevDripTokenAddress } from 'lib/utils/extractPrevDripTokenAddress'
import { fetchVolumeDripChainData } from 'lib/utils/fetchVolumeDripChainData'
import { sendTx } from 'lib/utils/sendTx'

const VolumeDripRow = (props) => {
  const { drip, handleDeactivate, isReferralVolumeDrips } = props

  return (
    <>
      <tr key={drip.id}>
        <td className='px-4 py-3 text-left font-bold'>{drip.tokenName}</td>
        <td className='px-4 py-3 text-left'>{drip.tokenSymbol}</td>
        <td className='px-4 py-3 text-left'>
          {displayAmountInEther(drip.tokenBalanceOf, {
            precision: 4,
            decimals: drip.tokenDecimals
          })}
        </td>
        <td className='px-4 pt-1 pb-1 text-right'>
          <button
            type='button'
            onClick={(e) => {
              e.preventDefault()
              handleDeactivate(drip.id, isReferralVolumeDrips)
            }}
            className='bg-red-1 p-1 rounded-full font-bold hover:bg-light-red mx-2'
          >
            <FeatherIcon
              strokeWidth='0.2rem'
              icon='x'
              className='w-4 h-4 hover:text-white m-auto'
            />
          </button>
        </td>
      </tr>
    </>
  )
}

const VolumeDripTable = (props) => {
  const { dripsLoading, drips, isReferralVolumeDrips } = props

  return (
    <>
      <table className='table-fixed w-full bg-card-selected rounded-lg'>
        <thead>
          <tr className='opacity-80 text-default'>
            <th className='bg-default w-1/4 px-4 pt-3 pb-2 text-left'>Token Name</th>
            <th className='bg-default w-1/4 px-4 pt-3 pb-2 text-left font-bold'>Token Symbol</th>
            <th className='bg-default w-1/4 px-4 pt-3 pb-2 text-left'>Comptroller's balance</th>
            <th className='bg-default w-1/4 px-4 pt-3 pb-2'>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {dripsLoading && (
            <>
              <tr>
                <td>
                  <LoadingDots />
                </td>
              </tr>
            </>
          )}

          {drips?.length === 0 && (
            <>
              <tr>
                <td className='px-4 py-3'>
                  No {isReferralVolumeDrips ? 'volume' : 'regular'} drips active...
                </td>
              </tr>
            </>
          )}

          {drips?.map((drip) => (
            <VolumeDripRow {...props} key={`volume-row-${drip.id}`} drip={drip} />
          ))}
        </tbody>
      </table>
    </>
  )
}

// if deactivating dripToken 3, pass in 2's address for prevDripToken
// or pass SENTINEL_ADDRESS if there are no other drips active
// const SENTINEL = '0x0000000000000000000000000000000000000001'
// prevDripTokens: this is a separate array for referral volume drips vs. non-referral!
const handleDeactivateVolumeDrip = async (
  txName,
  setTx,
  provider,
  contractAddress,
  prizeStrategyAddress,
  ticketAddress,
  dripTokenAddress,
  isReferral,
  prevDripTokens
) => {
  console.log(prevDripTokens)
  console.log({ dripTokenAddress })

  const prevTokenAddress =
    extractPrevDripTokenAddress(prevDripTokens, dripTokenAddress) || SENTINEL_ADDRESS
  console.log({ prevTokenAddress })

  const params = [
    prizeStrategyAddress,
    ticketAddress,
    dripTokenAddress,
    isReferral,
    prevTokenAddress,
    {
      gasLimit: 200000
    }
  ]
  console.log({ params })

  await sendTx(
    setTx,
    provider,
    contractAddress,
    ComptrollerAbi,
    'deactivateVolumeDrip',
    params,
    txName
  )
}

export const ListVolumeDrips = (props) => {
  const { poolAddresses } = props

  const router = useRouter()
  const networkName = router.query.networkName

  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider

  const comptrollerAddress = props?.poolAddresses?.tokenListener
  const ticketAddress = props?.poolAddresses?.ticket
  const prizeStrategyAddress = props?.poolAddresses?.prizeStrategy

  const [tx, setTx] = useState({})
  const txInFlight = tx.inWallet || tx.sent

  const txName = 'Deactivate Volume Drip'

  const [dripValues, setDripValues] = useState({})

  const fetchDrips = async () => {
    if (comptrollerAddress === ethers.constants.AddressZero) {
      console.warn(`TokenListener/Comptroller address still set to Address Zero, please update`)

      return
    }

    if (!Array.isArray(dripValues.drips)) {
      setDripValues({ loading: true })
    }

    const dripChainValues = await fetchVolumeDripChainData(
      networkName,
      comptrollerAddress,
      prizeStrategyAddress,
      ticketAddress
    )

    setDripValues(dripChainValues)
  }

  // don't use useInterval! The parent PoolUI component is running an interval and this
  // re-render is being used here on the useEffect below
  // useInterval(() => {
  //   fetchDrips()
  // }, 18000)

  useEffect(() => {
    fetchDrips()
  }, [poolAddresses])

  const dripsLoading = dripValues?.loading
  const drips = dripValues?.drips
  const referralDrips = dripValues?.referralDrips

  const handleDeactivate = (dripTokenAddress, isReferral) => {
    handleDeactivateVolumeDrip(
      txName,
      setTx,
      provider,
      comptrollerAddress,
      prizeStrategyAddress,
      ticketAddress,
      dripTokenAddress,
      !!isReferral,
      isReferral ? referralDrips : drips
    )
  }

  return (
    <>
      <div className='font-bold text-xs mb-1 mt-4'>Regular Volume Drips</div>
      <VolumeDripTable
        dripsLoading={dripsLoading}
        drips={drips}
        handleDeactivate={handleDeactivate}
      />

      <div className='font-bold text-xs mb-1 mt-8'>Referral Drips</div>
      <VolumeDripTable
        dripsLoading={dripsLoading}
        drips={referralDrips}
        handleDeactivate={handleDeactivate}
        isReferralVolumeDrips
      />
    </>
  )
}
