import React, { useContext, useEffect, useState } from 'react'
import PrizeStrategyAbi from '@pooltogether/pooltogether-contracts/abis/PeriodicPrizeStrategy'

import { Button } from 'lib/components/Button'
import { Card, CardSecondaryText } from 'lib/components/Card'
import { Collapse } from 'lib/components/Collapse'
import { DropdownInputGroup } from 'lib/components/DropdownInputGroup'
import { CONTRACT_ADDRESSES } from 'lib/constants'
import { useNetwork } from 'lib/hooks/useNetwork'
import { sendTx } from 'lib/utils/sendTx'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { TxMessage } from 'lib/components/TxMessage'
import { useUsersAddress } from 'lib/hooks/useUsersAddress'
import { ConnectWalletButton } from 'lib/components/ConnectWalletButton'
import { usePrizePoolContracts } from 'lib/hooks/usePrizePoolContracts'
import { useOnTransactionCompleted } from 'lib/hooks/useOnTransactionCompleted'
import { usePoolChainValues } from 'lib/hooks/usePoolChainValues'

const handleSetRngService = async (
  walletMatchesNetwork,
  txName,
  setTx,
  provider,
  prizeStrategyAddress,
  rngServiceAddress
) => {
  const params = [
    rngServiceAddress,
    {
      gasLimit: 200000
    }
  ]

  await sendTx(
    walletMatchesNetwork,
    setTx,
    provider,
    prizeStrategyAddress,
    PrizeStrategyAbi,
    'setRngService',
    params,
    txName
  )
}

export const RngServiceControlCard = (props) => {
  return (
    <Card>
      <Collapse title='Random Number Generator (RNG) Service'>
        <CardSecondaryText className='mb-8'>
          Choose the source of randomness the prize pool will use. This can be changed after pool
          creation.
        </CardSecondaryText>

        <RngServiceControlForm />
      </Collapse>
    </Card>
  )
}

const RngServiceControlForm = (props) => {
  const { data: prizePoolContracts } = usePrizePoolContracts()
  const usersAddress = useUsersAddress()
  const { refetch: refetchPoolChainValues } = usePoolChainValues()
  const { chainId, walletMatchesNetwork } = useNetwork()
  const [tx, setTx] = useState({})
  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider

  const rngServicesList = Object.keys(CONTRACT_ADDRESSES[chainId].RNG_SERVICE)
  const currentRngService = rngServicesList.find(
    (service) => CONTRACT_ADDRESSES[chainId].RNG_SERVICE[service] === prizePoolContracts.rng.address
  )
  const [newRngService, setNewRngService] = useState(currentRngService)

  // Listen for external updates
  useEffect(() => {
    setNewRngService(currentRngService)
  }, [currentRngService])

  const rngServices = {
    blockhash: {
      value: 'blockhash',
      view: 'Blockhash'
    },
    chainlink: {
      value: 'chainlink',
      view: 'Chainlink'
    }
  }

  const formatValue = (key) => rngServices[key].view

  const onValueSet = (newRngService) => {
    setNewRngService(newRngService)
  }

  const txName = 'Set RNG Service'

  const handleSubmit = (e) => {
    e.preventDefault()
    handleSetRngService(
      walletMatchesNetwork,
      txName,
      setTx,
      provider,
      prizePoolContracts.prizeStrategy.address,
      CONTRACT_ADDRESSES[chainId].RNG_SERVICE[newRngService]
    )
  }

  useOnTransactionCompleted(tx, refetchPoolChainValues)

  const resetState = (e) => {
    e.preventDefault()
    setTx({})
  }

  if (!usersAddress) {
    return <ConnectWalletButton className='w-full mt-4' />
  }

  if (tx.inWallet || tx.sent || tx.completed) {
    return <TxMessage txType={txName} tx={tx} handleReset={resetState} />
  }

  return (
    <form onSubmit={handleSubmit}>
      <DropdownInputGroup
        id='rng-dropdown'
        placeHolder='Select a random number generator service'
        label={'Random number generator service'}
        containerClassName='mb-8 w-full'
        formatValue={formatValue}
        onValueSet={onValueSet}
        current={currentRngService}
        values={rngServices}
      />
      <Button color='secondary' size='lg' disabled={!walletMatchesNetwork}>
        Update RNG service
      </Button>
    </form>
  )
}
