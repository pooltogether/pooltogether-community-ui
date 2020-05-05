import React, { useContext, useState } from 'react'
import { ethers } from 'ethers'
import { batch, contract } from '@pooltogether/etherplex'

import PoolAbi from 'lib/abis/PoolAbi'

import { ADDRESSES } from 'lib/constants'
import { DepositForm } from 'lib/components/DepositForm'
// import { DepositPanel } from 'lib/components/DepositPanel'
import { TxMessage } from 'lib/components/TxMessage'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { poolToast } from 'lib/utils/poolToast'

const digChainIdFromWalletState = (walletContext) => {
  const onboard = walletContext._onboard

  let chainId = 1
  if (onboard) {
    chainId = onboard.getState().appNetworkId
  }

  return chainId
}

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
    PoolAbi,
    signer
  )

  try {
    console.log({ depositAmount})
    const newTx = await poolContract.mintTickets(
      ethers.utils.bigNumberify(depositAmount),
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
  // const [depositAmount, setDepositAmount] = useState('')
  const [tx, setTx] = useState({
    inWallet: false,
    sent: false,
    completed: false,
  })

  const txInFlight = tx.inWallet || tx.sent

  const chainId = digChainIdFromWalletState(walletContext)
  const poolContractAddress = ADDRESSES[chainId]['POOL_CONTRACT_ADDRESS']
  const etherplexPoolContract = contract('DaiPool', PoolAbi, poolContractAddress)
  console.log({ etherplexPoolContract})
  const usersDaiBalance = 2
  const usersPoolBalance = 23

  const usersAddress = walletContext._onboard.getState().address

  batch(
    ethers.getDefaultProvider(),
    etherplexPoolContract
      .totalBalanceOf(usersAddress),
  ).then(results => {
    console.log('Your data', results)
  }).catch(e => {
    console.error('Uh-or read error', e)
  })

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
      
    </div>
    
  </>
}

