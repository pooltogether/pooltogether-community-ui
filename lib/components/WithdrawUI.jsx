import CompoundPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/CompoundPrizePool'
import { ethers } from 'ethers'
import { TxMessage } from 'lib/components/TxMessage'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { WithdrawForm } from 'lib/components/WithdrawForm'
import { useDebounce } from 'lib/hooks/useDebounce'
import { fetchExitFee } from 'lib/utils/fetchExitFee'
import { poolToast } from 'lib/utils/poolToast'
import { sendTx } from 'lib/utils/sendTx'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'

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
  if (!withdrawAmount) {
    poolToast.error(`Withdraw Amount needs to be filled in`)
    return
  }

  const params = [usersAddress, ethers.utils.parseUnits(withdrawAmount, decimals), ticketAddress]

  let method = 'withdrawWithTimelockFrom'
  if (withdrawType === 'instant') {
    method = 'withdrawInstantlyFrom'
    params.push(maxExitFee)
  }

  // TX overrides
  params.push({ gasLimit: 800000 })

  await sendTx(setTx, provider, contractAddress, CompoundPrizePoolAbi, method, params, 'Withdraw')
}

export const WithdrawUI = (props) => {
  const { poolChainValues } = props

  const { tokenDecimals } = poolChainValues

  const router = useRouter()
  const networkName = router.query.networkName

  const prizePool = props.poolAddresses.prizePool
  const ticketAddress = props.poolAddresses.ticket

  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider
  const usersAddress = walletContext._onboard.getState().address

  const [exitFees, setExitFees] = useState({})
  const maxExitFee = exitFees?.exitFee

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
          ethers.utils.parseUnits(debouncedWithdrawAmount, tokenDecimals)
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
    completed: false
  })

  const txInFlight = tx.inWallet || tx.sent

  const resetState = (e) => {
    e.preventDefault()
    setWithdrawAmount('')
    setTx({})
  }

  return (
    <>
      {!txInFlight ? (
        <>
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
                tokenDecimals
              )
            }}
            vars={{
              maxExitFee,
              withdrawAmount,
              withdrawType
            }}
            stateSetters={{
              setWithdrawAmount,
              setWithdrawType
            }}
          />
        </>
      ) : (
        <>
          <TxMessage txType='Withdraw' tx={tx} handleReset={resetState} />
        </>
      )}
    </>
  )
}
