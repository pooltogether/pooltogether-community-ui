import React, { useContext, useState } from 'react'
import FeatherIcon from 'feather-icons-react'
import { ethers } from 'ethers'

import ComptrollerAbi from '@pooltogether/pooltogether-contracts/abis/Comptroller'

import { Button } from 'lib/components/Button'
import { FormLockedOverlay } from 'lib/components/FormLockedOverlay'
import { TextInputGroup } from 'lib/components/TextInputGroup'
import { TxMessage } from 'lib/components/TxMessage'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { poolToast } from 'lib/utils/poolToast'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { sendTx } from 'lib/utils/sendTx'

// deactivateBalanceDrip(prizeStrategyAddress, controlledTokenAddress, erc20Address)
// [1, 2, 3, 4, 5]
// if deactivating 3, pass in 2's address for prevDripToken
// or pass SENTINAL_ADDRESS if there are no other drips active
// const SENTINAL = '0x0000000000000000000000000000000000000001'
const handleDeactivateBalanceDrip = async (
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
    'deactivateBalanceDrip',
    params,
    txName,
  )
}

export const ListBalanceDrips = (props) => {
  const {
    genericChainValues,
    // adminChainValues, ?
  } = props

  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider

  // query comptroller for all active drips for a specific prizeStrategyAddress
  // const prizeStrategyAddress = props.poolAddresses.prizeStrategyAddress

  const [tx, setTx] = useState({})
  const txInFlight = tx.inWallet || tx.sent

  const txName = 'Deactivate Balance Drip'

  const handleDeactivate = (erc20TokenAddress) => {
    handleDeactivateBalanceDrip(
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
        <table className='table-fixed w-full bg-card-selected rounded-lg'>
          <thead>
            <tr className='opacity-80'>
              <th className='bg-default w-1/4 px-4 pt-3 pb-2 text-left'>Token Name</th>
              <th className='bg-default w-1/4 px-4 pt-3 pb-2 text-left font-bold'>Token Symbol</th>
              <th className='bg-default w-1/4 px-4 pt-3 pb-2 text-left'>Comptroller's balance</th>
              <th className='bg-default w-1/4 px-4 pt-3 pb-2'>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            <tr>
            {/* <tr key={dripData.id}> */}
              <td className='px-4 pt-1 pb-1 text-left font-bold'>
                Example
              </td>
              <td className='px-4 pt-1 pb-1 text-left'>
                EXAMP
              </td>
              <td className='px-4 pt-1 pb-1 text-left'>
                4.234
              </td>
              <td className='px-4 pt-1 pb-1 text-right'>
                <button
                  type='button'
                  onClick={(e) => {
                    e.preventDefault()
                    handleDeactivate(erc20TokenAddress)
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
          </tbody>
        </table>


  </>
}
