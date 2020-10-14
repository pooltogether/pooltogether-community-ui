import React, { useContext, useState } from 'react'
import { ethers } from 'ethers'

import CompoundPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/CompoundPrizePool'
import PermitAndDepositDaiAbi from '@pooltogether/pooltogether-contracts/abis/PermitAndDepositDai'
import DaiAbi from '@pooltogether/pooltogether-contracts/abis/Dai'

import { signPermit } from 'lib/utils/signPermit'
import { CONTRACT_ADDRESSES } from 'lib/constants'
import { DepositForm } from 'lib/components/DepositForm'
import { TxMessage } from 'lib/components/TxMessage'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { poolToast } from 'lib/utils/poolToast'
import { sendTx } from 'lib/utils/sendTx'

const handleDepositSubmit = async (
  setTx,
  provider,
  usersAddress,
  contractAddress,
  ticketAddress,
  tokenAddress,
  depositAmount,
  decimals,
  chainId
) => {
  if (
    !depositAmount
  ) {
    poolToast.error(`Deposit Amount needs to be filled in`)
    return
  }
  
  const signer = await provider.getSigner()
  const permitAddress = CONTRACT_ADDRESSES[chainId].PermitAndDepositDai
  const dai = new ethers.Contract(tokenAddress, DaiAbi, provider)
  const nonce = await dai.nonces(usersAddress)
  const expiry = (new Date()).getTime() + 1200000 // 20 minutes into future

  const holder = await signer.getAddress()

  let permit = await signPermit(
    signer,
    {
      name: "Dai Stablecoin",
      version: "1",
      chainId,
      verifyingContract: tokenAddress,
    },
    {
      holder,
      spender: permitAddress,
      nonce: nonce.toString(),
      expiry,
      allowed: true
    }
  )
  let { v, r, s } = ethers.utils.splitSignature(permit.sig)

  const referrer = ethers.constants.AddressZero // TODO
  const params = [
    tokenAddress,
    usersAddress,
    nonce,
    expiry,
    true,
    v,
    r,
    s,
    contractAddress,
    usersAddress,
    ethers.utils.parseUnits(depositAmount, decimals),
    ticketAddress,
    referrer,
    {
      gasLimit: 600000
    }
  ]

  await sendTx(
    setTx,
    provider,
    permitAddress,
    PermitAndDepositDaiAbi,
    'permitAndDepositTo',
    params,
    'Permit & Deposit',
  )
}

export const PermitAndDepositUI = (props) => {
  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider
  const usersAddress = walletContext._onboard.getState().address
  const ticketAddress = props.poolAddresses.ticket
  const tokenAddress = props.poolAddresses.token

  const { _onboard } = walletContext || {}
  const chainId = _onboard.getState().appNetworkId

  const [depositAmount, setDepositAmount] = useState('')

  const [tx, setTx] = useState({})

  const txInFlight = tx.inWallet || tx.sent

  const resetState = (e) => {
    e.preventDefault()
    setDepositAmount('')
    setTx({})
  }

  return <>
    {!txInFlight ? <>
      <DepositForm
        {...props}
        genericChainValues={props.genericChainValues}
        handleSubmit={(e) => {
          e.preventDefault()
          handleDepositSubmit(
            setTx,
            provider,
            usersAddress,
            props.poolAddresses.prizePool,
            ticketAddress,
            tokenAddress,
            depositAmount,
            props.genericChainValues.tokenDecimals,
            chainId
          )
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
        txType='Deposit'
        tx={tx}
        handleReset={resetState}
      />
    </>}

  </>
}
