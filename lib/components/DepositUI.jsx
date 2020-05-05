import React, { useContext, useState } from 'react'
import { ethers } from 'ethers'

import { ADDRESSES } from 'lib/constants'
import { DepositForm } from 'lib/components/DepositForm'
// import { DepositPanel } from 'lib/components/DepositPanel'
import { TxMessage } from 'lib/components/TxMessage'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { poolToast } from 'lib/utils/poolToast'

const digChainIdFromWalletState = () => {
  const walletContext = useContext(WalletContext)
  const onboard = walletContext._onboard

  let chainId = 1
  if (onboard) {
    chainId = onboard.getState().appNetworkId
  }

  return chainId
}

const handleSubmit = async (setTx) => {
  const chainId = digChainIdFromWalletState()

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

  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider
  const signer = provider.getSigner()

  const poolContract = new ethers.Contract(
    poolContractAddress,
    PoolAbi,
    signer
  )

  try {
    const newTx = await poolContract.deposit(
      mintTickets,
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
  const [depositAmount, setDepositAmount] = useState(ethers.utils.bigNumberify(0))
  // const [depositAmount, setDepositAmount] = useState(ethers.utils.bigNumberify(0))
  const [tx, setTx] = useState({
    inWallet: false,
    sent: false,
    completed: false,
  })

  const txInFlight = tx.inWallet || tx.sent

  const usersDaiBalance = 2
  const usersPoolBalance = 23

  return <>
    <div
      className='bg-purple-1000 -mx-8 sm:-mx-0 py-4 px-8 sm:p-10 pb-16 rounded-xl lg:w-3/4 text-base sm:text-lg mb-20'
    >
      {!txInFlight ? <>
        DAI Balance:
        <br />
        {usersDaiBalance}

        <hr />
        Pool Balance:
        <br />
        {usersPoolBalance}
        {/* <DepositPanel
        /> */}
        <DepositForm
          handleSubmit={(e) => {
            e.preventDefault()

            handleSubmit(setTx)
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
      
    </div>
    
  </>
}

