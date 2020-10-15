import React, { useContext, useEffect, useState } from 'react'
import FeatherIcon from 'feather-icons-react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'

import ComptrollerAbi from '@pooltogether/pooltogether-contracts/abis/Comptroller'

import { LoadingDots } from 'lib/components/LoadingDots'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { fetchVolumeDripChainData } from 'lib/utils/fetchVolumeDripChainData'
import { sendTx } from 'lib/utils/sendTx'

const VolumeDripRow = (props) => {
  const { drip } = props

  return <>
    <tr
      key={drip.id}
    >
      <td className='px-4 py-3 text-left font-bold'>
        {drip.tokenName}
      </td>
      <td className='px-4 py-3 text-left'>
        {drip.tokenSymbol}
      </td>
      <td className='px-4 py-3 text-left'>
        {displayAmountInEther(drip.tokenBalanceOf, {
          precision: 4, decimals: drip.tokenDecimals
        })}
      </td>
      <td className='px-4 pt-1 pb-1 text-right'>
        <button
          type='button'
          onClick={(e) => {
            e.preventDefault()
            handleDeactivate(drip.id)
          }}
          className='bg-red p-1 rounded-full font-bold hover:bg-light-red mx-2'
        >
          <FeatherIcon
            icon='x'
            className='w-4 h-4 hover:text-white m-auto'
          />
        </button>
      </td>
    </tr>
  </>
}


const VolumeDripTable = (props) => {
  const {
    dripsLoading,
    drips,
    isReferralVolumeDrips,
    handleDeactivate,
  } = props

  return <>
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
        {dripsLoading && <>
          <tr><td><LoadingDots /></td></tr>
        </>}

        {(drips?.length === 0) && <>
          <tr><td
            className='px-4 py-3'
          >No {isReferralVolumeDrips ? 'volume' : 'regular'} drips active...</td></tr>
        </>}

        {drips?.map(drip => <VolumeDripRow
          handleDeactivate={handleDeactivate}
          drip={drip}
        />)}

      </tbody>
    </table>
  </>
}


// deactivateVolumeDrip(prizeStrategyAddress, controlledTokenAddress, erc20Address)
// [1, 2, 3, 4, 5]
// if deactivating 3, pass in 2's address for prevDripToken
// or pass SENTINAL_ADDRESS if there are no other drips active
// const SENTINAL = '0x0000000000000000000000000000000000000001'
const handleDeactivateVolumeDrip = async (
  txName,
  setTx,
  provider,
  contractAddress,
  prizeStrategyAddress,
  ticketAddress,
  erc20Address,
) => {
  const params = [
    prizeStrategyAddress,
    ticketAddress,
    erc20Address,
    {
      gasLimit: 200000
    }
  ]

  await sendTx(
    setTx,
    provider,
    contractAddress,
    ComptrollerAbi,
    'deactivateVolumeDrip',
    params,
    txName,
  )
}

export const ListVolumeDrips = (props) => {
  const {
    genericChainValues,
    poolAddresses,
    // adminChainValues, ?
  } = props

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
      ticketAddress,
    )

    setDripValues(
      dripChainValues
    )
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

  // console.log(tx)

  const handleDeactivate = (erc20TokenAddress) => {
    handleDeactivateVolumeDrip(
      txName,
      setTx,
      provider,
      comptrollerAddress,
      prizeStrategyAddress,
      ticketAddress,
      erc20TokenAddress,
    )
  }

  return <>
    <div
      className='font-bold text-xs mb-1 mt-4'
    >
      Regular Volume Drips
    </div>
    <VolumeDripTable
      dripsLoading={dripsLoading}
      drips={drips}
      handleDeactivate={handleDeactivate}
    />

    <div
      className='font-bold text-xs mb-1 mt-8'
    >
      Referral Drips
    </div>
    <VolumeDripTable
      dripsLoading={dripsLoading}
      drips={referralDrips}
      handleDeactivate={handleDeactivate}
      isReferralVolumeDrips
    />
  </>
}
