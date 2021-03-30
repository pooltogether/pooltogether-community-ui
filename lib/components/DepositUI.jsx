import React, { useContext, useState } from 'react'
import CompoundPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/CompoundPrizePool'
import { ethers } from 'ethers'

import { BlockExplorerLink, LinkIcon } from 'lib/components/BlockExplorerLink'
import { ConnectWalletButton } from 'lib/components/ConnectWalletButton'
import { DepositForm } from 'lib/components/DepositForm'
import { TxMessage } from 'lib/components/TxMessage'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { parseNumString } from 'lib/utils/parseNumString'
import { sendTx } from 'lib/utils/sendTx'
import { useNetwork } from 'lib/hooks/useNetwork'
import { useUsersAddress } from 'lib/hooks/useUsersAddress'
import { usePrizePoolContracts } from 'lib/hooks/usePrizePoolContracts'
import { usePoolChainValues } from 'lib/hooks/usePoolChainValues'
import { NETWORK } from 'lib/utils/networks'

const handleDepositSubmit = async (
  walletMatchesNetwork,
  setTx,
  provider,
  usersAddress,
  contractAddress,
  ticketAddress,
  depositAmountBN
) => {
  const referrer = ethers.constants.AddressZero // TODO

  const params = [usersAddress, depositAmountBN, ticketAddress, referrer]

  await sendTx(
    walletMatchesNetwork,
    setTx,
    provider,
    contractAddress,
    CompoundPrizePoolAbi,
    'depositTo',
    params,
    'Deposit'
  )
}

export const DepositUI = () => {
  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider
  const { walletMatchesNetwork } = useNetwork()
  const usersAddress = useUsersAddress()
  const {
    data: prizePoolContracts,
    isFetched: prizePoolContractsIsFetched
  } = usePrizePoolContracts()
  const { data: poolChainValues, isFetched: poolChainValuesIsFetched } = usePoolChainValues()
  const [depositAmount, setDepositAmount] = useState('')
  const [tx, setTx] = useState({
    inWallet: false,
    sent: false,
    completed: false
  })

  if (!poolChainValuesIsFetched || !prizePoolContractsIsFetched) return null

  const prizePoolAddress = prizePoolContracts.prizePool.address
  const ticketAddress = prizePoolContracts.ticket.address
  const tokenSymbol = poolChainValues.token.symbol
  const ticketSymbol = poolChainValues.ticket.symbol

  const depositMessage = (
    <>
      You can deposit{' '}
      <span className='underline'>
        <BlockExplorerLink address={poolChainValues.token.address}>
          {tokenSymbol} <LinkIcon />
        </BlockExplorerLink>
      </span>{' '}
      to be eligible to win the prizes in this pool. Once deposited you will receive {ticketSymbol}{' '}
      and be entered to win until your {tokenSymbol} is withdrawn.
    </>
  )

  const txInFlight = tx.inWallet || tx.sent

  const decimals = poolChainValues.token.decimals
  const depositAmountBN = parseNumString(depositAmount, decimals)
  const inputError = !depositAmountBN

  const resetState = (e) => {
    e.preventDefault()
    setDepositAmount('')
    setTx({
      inWallet: false,
      sent: false,
      completed: false
    })
  }

  if (!usersAddress) {
    return <ConnectWalletButton className='w-full mt-4' />
  }

  if (txInFlight) {
    return (
      <>
        <div className='mb-4 sm:mb-8 text-sm sm:text-base text-accent-1'>{depositMessage}</div>
        <TxMessage
          txType='Deposit'
          tx={tx}
          handleReset={resetState}
          resetButtonText='Deposit more'
        />
      </>
    )
  }

  return (
    <>
      <div className='mb-4 sm:mb-8 text-sm sm:text-base text-accent-1'>{depositMessage}</div>
      <DepositForm
        inputError={inputError}
        handleSubmit={(e) => {
          e.preventDefault()
          handleDepositSubmit(
            walletMatchesNetwork,
            setTx,
            provider,
            usersAddress,
            prizePoolAddress,
            ticketAddress,
            depositAmountBN
          )
        }}
        vars={{
          depositAmount
        }}
        stateSetters={{
          setDepositAmount
        }}
      />
      <GetTokensOnL2Prompt token={poolChainValues.token} />
    </>
  )
}

const BRIDGEABLE_NETWORKS = [NETWORK.matic]

const GetTokensOnL2Prompt = (props) => {
  const { chainId, view: networkView } = useNetwork()
  const { token } = props
  const { name, address } = token

  if (!BRIDGEABLE_NETWORKS.includes(chainId)) {
    return null
  }

  return (
    <div className='text-accent-1 text-sm sm:text-base'>
      Need{' '}
      <BlockExplorerLink address={address} className='underline'>
        {name}
      </BlockExplorerLink>
      ? Check out token bridging on{' '}
      <a
        href='https://zapper.fi/bridge'
        target='_blank'
        className='underline trans hover:opacity-70'
      >
        Zapper
      </a>{' '}
      or purchasing tokens with fiat for {networkView}.
    </div>
  )
}
