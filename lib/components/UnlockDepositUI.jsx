import React, { useContext, useState } from 'react'
import { ethers } from 'ethers'

import ERC20Abi from '@pooltogether/pooltogether-contracts/abis/ERC20'

import { Button } from 'lib/components/Button'
import { DepositForm } from 'lib/components/DepositForm'
// import { DepositPanel } from 'lib/components/DepositPanel'
import { TxMessage } from 'lib/components/TxMessage'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { getPoolContractAddress } from 'lib/utils/getPoolContractAddress'
import { poolToast } from 'lib/utils/poolToast'

const handleSubmit = async (setTx, walletContext, chainValues) => {
  const poolContractAddress = getPoolContractAddress(walletContext)

  setTx(tx => ({
    ...tx,
    inWallet: true
  }))

  const provider = walletContext.state.provider
  const signer = provider.getSigner()

  const erc20Contract = new ethers.Contract(
    chainValues.erc20ContractAddress,
    ERC20Abi,
    signer
  )

  try {
    console.log({ chainValues})
    const newTx = await erc20Contract.approve(
      chainValues.ticketAddress,
      ethers.utils.parseEther('1000000000'),
      {
        gasLimit: 100000,
      }
    )

    setTx(tx => ({
      ...tx,
      hash: newTx.hash,
      sent: true,
    }))

    await newTx.wait()

    setTx(tx => ({
      ...tx,
      completed: true,
    }))

    poolToast.success('Unlock Allowance transaction complete!')
  } catch (e) {
    setTx(tx => ({
      ...tx,
      hash: '',
      inWallet: true,
      sent: true,
      completed: true,
      error: true
    }))

    poolToast.error(`Error with transaction. See JS Console`)

    console.error(e.message)
  }
}


export const UnlockDepositUI = (props) => {
  const {
    chainValues
  } = props

  const walletContext = useContext(WalletContext)

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
        disabled
        handleSubmit={(e) => {
          e.preventDefault()

          handleSubmit(setTx, walletContext, chainValues)
        }}
      />
    </> : <>
      <TxMessage
        txType='Unlock Token Deposits'
        tx={tx}
      />
    </>}

    {txCompleted && <>
      <div className='my-3 text-center'>
        <Button
          size='sm'
          color='black'
          onClick={resetState}
        >Reset Form</Button>
      </div>
    </>}

    
  </>
}

