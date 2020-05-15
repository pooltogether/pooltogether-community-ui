import React, { useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'

import PeriodicPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PeriodicPrizePool'

import { useDebounce } from 'lib/hooks/useDebounce'
import { Button } from 'lib/components/Button'
import { WithdrawForm } from 'lib/components/WithdrawForm'
import { TxMessage } from 'lib/components/TxMessage'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { fetchExitFee } from 'lib/utils/fetchExitFee'
import { poolToast } from 'lib/utils/poolToast'
import { sendTx } from 'lib/utils/sendTx'

const handleWithdrawSubmit = async (
  setTx,
  provider,
  contractAddress,
  withdrawAmount,
  withdrawType,
  decimals
) => {
  if (
    !withdrawAmount
  ) {
    poolToast.error(`Withdraw Amount needs to be filled in`)
    return
  }

  const params = [
    ethers.utils.parseUnits(withdrawAmount, decimals),
    {
      gasLimit: 500000
    }
  ]

  const method = withdrawType === 'instant' ?
    'redeemTicketsInstantly' :
    'redeemTicketsWithTimelock'

  await sendTx(
    setTx,
    provider,
    contractAddress,
    PeriodicPrizePoolAbi,
    method,
    params,
    'Withdraw'
  )
}

export const WithdrawUI = (props) => {
  const router = useRouter()
  const networkName = router.query.networkName
  const pool = router.query.poolAddress

  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider
  const usersAddress = walletContext._onboard.getState().address

  const [exitFee, setExitFee] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawType, setWithdrawType] = useState('scheduled')

  const debouncedWithdrawAmount = useDebounce(withdrawAmount, 500)

  useEffect(() => {
    const t = async () => {
      if (debouncedWithdrawAmount) {
        const result = await fetchExitFee(
          networkName,
          usersAddress,
          pool,
          debouncedWithdrawAmount
        )
        setExitFee(result.exitFee)
      } else {
        setExitFee(null)
      }
    }

    t()
  }, [debouncedWithdrawAmount])


  const [tx, setTx] = useState({
    inWallet: false,
    sent: false,
    completed: false,
  })

  const txInFlight = tx.inWallet || tx.sent
  const txCompleted = tx.completed

  const resetState = (e) => {
    e.preventDefault()
    setWithdrawAmount('')
    setTx({})
  }

  return <>
    {!txInFlight ? <>
      <WithdrawForm
        {...props}
        exitFee={exitFee}
        handleSubmit={(e) => {
          e.preventDefault()

          handleWithdrawSubmit(
            setTx,
            provider,
            props.poolAddresses.pool,
            withdrawAmount,
            withdrawType,
            props.genericChainValues.erc20Decimals
          )
        }}
        vars={{
          withdrawAmount,
          withdrawType,
        }}
        stateSetters={{
          setWithdrawAmount,
          setWithdrawType,
        }}
      />
    </> : <>
      <TxMessage
        txType='Withdraw to Pool'
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

