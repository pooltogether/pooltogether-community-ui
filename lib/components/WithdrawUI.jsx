import React, { useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'

import CompoundPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/CompoundPrizePool'

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
  ticketAddress,
  usersAddress,
  withdrawAmount,
  withdrawType,
  maxExitFee,
  decimals
) => {
  if (
    !withdrawAmount
  ) {
    poolToast.error(`Withdraw Amount needs to be filled in`)
    return
  }

  const params = [
    usersAddress,
    ethers.utils.parseUnits(withdrawAmount, decimals),
    ticketAddress,
  ]

  let method = 'withdrawWithTimelockFrom'
  if (withdrawType === 'instant') {
    method = 'withdrawInstantlyFrom'
    params.push(
      ethers.utils.parseEther(maxExitFee)
    )
  }

  // TX "data" param
  // params.push([])

  // TX overrides
  params.push({gasLimit: 350000})

  await sendTx(
    setTx,
    provider,
    contractAddress,
    CompoundPrizePoolAbi,
    method,
    params,
    'Withdraw'
  )
}

export const WithdrawUI = (props) => {
  const router = useRouter()
  const networkName = router.query.networkName
  const prizePool = props.poolAddresses.prizePool
  const ticketAddress = props.poolAddresses.ticket

  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider
  const usersAddress = walletContext._onboard.getState().address

  const [exitFees, setExitFees] = useState({})
  const [maxExitFee, setMaxExitFee] = useState('1')
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
          ticketAddress,
          ethers.utils.parseEther(debouncedWithdrawAmount)
        )
        setExitFees(result)
      } else {
        setExitFees(null)
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
        exitFees={exitFees}
        handleSubmit={(e) => {
          e.preventDefault()

          handleWithdrawSubmit(
            setTx,
            provider,
            prizePool,
            ticketAddress,
            usersAddress,
            withdrawAmount,
            withdrawType,
            maxExitFee,
            props.genericChainValues.tokenDecimals
          )
        }}
        vars={{
          maxExitFee,
          withdrawAmount,
          withdrawType,
        }}
        stateSetters={{
          setMaxExitFee,
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
