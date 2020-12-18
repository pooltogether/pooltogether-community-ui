import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'
import { useAtom } from 'jotai'
import CompoundPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/CompoundPrizePool'

import { TxMessage } from 'lib/components/TxMessage'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { WithdrawForm } from 'lib/components/WithdrawForm'
import { useDebounce } from 'lib/hooks/useDebounce'
import { poolChainValuesAtom } from 'lib/hooks/usePoolChainValues'
import { fetchExitFee } from 'lib/utils/fetchExitFee'
import { poolToast } from 'lib/utils/poolToast'
import { sendTx } from 'lib/utils/sendTx'
import { poolAddressesAtom } from 'lib/hooks/usePoolAddresses'
import { networkAtom } from 'lib/hooks/useNetwork'
import { usersAddressAtom } from 'lib/hooks/useUsersAddress'
import { ConnectWalletButton } from 'lib/components/ConnectWalletButton'

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
  const walletContext = useContext(WalletContext)
  const [poolAddresses] = useAtom(poolAddressesAtom)
  const [poolChainValues] = useAtom(poolChainValuesAtom)
  const [usersAddress] = useAtom(usersAddressAtom)
  const [network] = useAtom(networkAtom)

  const { tokenDecimals } = poolChainValues
  const { networkName } = network
  const { prizePool, ticket: ticketAddress } = poolAddresses

  const provider = walletContext.state.provider

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
    setTx({
      inWallet: false,
      sent: false,
      completed: false
    })
  }

  if (!usersAddress) {
    return <ConnectWalletButton />
  }

  if (txInFlight) {
    return <TxMessage txType='Withdraw' tx={tx} handleReset={resetState} />
  }

  return (
    <>
      <div className='mb-4 sm:mb-8 text-sm sm:text-base text-accent-1'>
        You can choose to withdraw the deposited fund at any time. By withdrawing the fund, you are
        eliminating/reducing the chance to win the prize in this pool in the next prize periods.
      </div>
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
  )
}
