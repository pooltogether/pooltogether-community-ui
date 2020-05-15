import React, { useContext, useState } from 'react'
import { ethers } from 'ethers'

import ERC20Abi from '@pooltogether/pooltogether-contracts/abis/ERC20'

import { DepositForm } from 'lib/components/DepositForm'
import { TxMessage } from 'lib/components/TxMessage'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { poolToast } from 'lib/utils/poolToast'
import { sendTx } from 'lib/utils/sendTx'

const handleUnlockSubmit = async (
  setTx,
  provider,
  contractAddress,
  poolAddress,
  decimals,
) => {
  const params = [
    poolAddress,
    ethers.utils.parseUnits('1000000000', decimals),
    {
      gasLimit: 200000
    }
  ]

  await sendTx(
    setTx,
    provider,
    contractAddress,
    ERC20Abi,
    'approve',
    params,
  )

  poolToast.success('Deposit transaction complete!')
}

export const UnlockDepositUI = (props) => {
  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider

  const [tx, setTx] = useState({})

  const txInFlight = tx.inWallet || tx.sent
  const txCompleted = tx.completed

  const resetState = (e) => {
    e.preventDefault()
    setTx({})
  }

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
            props.poolAddresses.erc20,
            props.poolAddresses.pool,
            props.genericChainValues.erc20Decimals,
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

