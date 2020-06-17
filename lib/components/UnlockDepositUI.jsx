import React, { useContext, useState } from 'react'
import { ethers } from 'ethers'

import IERC20Abi from '@pooltogether/pooltogether-contracts/abis/IERC20'

import { DepositForm } from 'lib/components/DepositForm'
import { TxMessage } from 'lib/components/TxMessage'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { sendTx } from 'lib/utils/sendTx'

const handleUnlockSubmit = async (
  setTx,
  provider,
  contractAddress,
  prizePoolAddress,
  decimals,
) => {
  const params = [
    prizePoolAddress,
    ethers.utils.parseUnits('1000000000', decimals),
    {
      gasLimit: 200000
    }
  ]

  await sendTx(
    setTx,
    provider,
    contractAddress,
    IERC20Abi,
    'approve',
    params,
    'Unlock Deposits',
  )
}

export const UnlockDepositUI = (props) => {
  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider

  const [tx, setTx] = useState({})

  const txInFlight = tx.inWallet || tx.sent

  return <>
    {!txInFlight ? <>
      <DepositForm
        {...props}
        disabled
        handleSubmit={(e) => {
          e.preventDefault()

          handleUnlockSubmit(
            setTx,
            provider,
            props.poolAddresses.token,
            props.poolAddresses.prizePool,
            props.genericChainValues.tokenDecimals,
          )
        }}
      />
    </> : <>
      <TxMessage
        txType='Unlock Token Deposits'
        tx={tx}
      />
    </>}
    
  </>
}

