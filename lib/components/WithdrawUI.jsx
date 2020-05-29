import React, { useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'

import TicketAbi from '@pooltogether/pooltogether-contracts/abis/Ticket'

import { useDebounce } from 'lib/hooks/useDebounce'
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
    [],
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
    TicketAbi,
    method,
    params,
    'Withdraw'
  )
}

export const WithdrawUI = (props) => {
  const router = useRouter()
  const networkName = router.query.networkName
  const prizePool = props.poolAddresses.prizePool

  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider
  const usersAddress = walletContext._onboard.getState().address

  const [exitFee, setExitFee] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawType, setWithdrawType] = useState('scheduled')

  const debouncedWithdrawAmount = useDebounce(withdrawAmount, 300)

  useEffect(() => {
    const t = async () => {
      if (debouncedWithdrawAmount) {
        const result = await fetchExitFee(
          networkName,
          usersAddress,
          prizePool,
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
            props.poolAddresses.ticket,
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
        handleReset={resetState}
      />
    </>}
    
  </>
}

