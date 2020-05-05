import React, { useContext, useState } from 'react'
import { ethers } from 'ethers'

import PeriodicPrizePoolAbi from 'lib/abis/PeriodicPrizePoolAbi'

import { ADDRESSES } from 'lib/constants'
import { DepositForm } from 'lib/components/DepositForm'
// import { DepositPanel } from 'lib/components/DepositPanel'
import { TxMessage } from 'lib/components/TxMessage'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { digChainIdFromWalletState } from 'lib/utils/digChainIdFromWalletState'
import { poolToast } from 'lib/utils/poolToast'

const handleSubmit = async (setTx, walletContext, depositAmount) => {
  const chainId = digChainIdFromWalletState(walletContext)

  const poolContractAddress = ADDRESSES[chainId]['POOL_CONTRACT_ADDRESS']

  if (
    !depositAmount
  ) {
    poolToast.error(`Deposit Amount needs to be filled in`)
    console.error(`depositAmount needs to be filled in!`)
    return
  }

  setTx(tx => ({
    ...tx,
    inWallet: true
  }))


  const provider = walletContext.state.provider
  const signer = provider.getSigner()

  const poolContract = new ethers.Contract(
    poolContractAddress,
    PeriodicPrizePoolAbi,
    signer
  )

  try {
    console.log({ depositAmount})
    console.log(ethers.utils.parseEther(depositAmount))
    const newTx = await poolContract.mintTickets(
      ethers.utils.parseEther(depositAmount),
      {
        gasLimit: 200000,
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

    poolToast.success('Deposit transaction complete!')
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


export const DepositUI = (props) => {
  const walletContext = useContext(WalletContext)

  const [depositAmount, setDepositAmount] = useState('')

  const [tx, setTx] = useState({
    inWallet: false,
    sent: false,
    completed: false,
  })

  const txInFlight = tx.inWallet || tx.sent

  return <>
    
    {!txInFlight ? <>
      <DepositForm
        handleSubmit={(e) => {
          e.preventDefault()

          handleSubmit(setTx, walletContext, depositAmount)
        }}
        vars={{
          depositAmount,
        }}
        stateSetters={{
          setDepositAmount,
        }}
      />
    </> : <>
      <TxMessage
        txType='Deposit to Pool'
        tx={tx}
      />
    </>}
      
    
  </>
}

