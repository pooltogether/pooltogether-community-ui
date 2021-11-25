import React, { useEffect, useState } from 'react'
import PrizeStrategyAbi from '@pooltogether/pooltogether-contracts/abis/PeriodicPrizeStrategy'

import { CONTRACT_ADDRESSES } from 'lib/constants'
import { Button } from 'lib/components/Button'
import { Card, CardSecondaryText } from 'lib/components/Card'
import { Collapse } from 'lib/components/Collapse'
import { DropdownInputGroup } from 'lib/components/DropdownInputGroup'
import { ConnectWalletButton } from 'lib/components/ConnectWalletButton'
import { TxMessage } from 'lib/components/TxMessage'
import { useUsersAddress } from 'lib/hooks/useUsersAddress'
import { useNetwork } from 'lib/hooks/useNetwork'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { usePrizePoolContracts } from 'lib/hooks/usePrizePoolContracts'
import { useOnTransactionCompleted } from 'lib/hooks/useOnTransactionCompleted'
import { usePoolChainValues } from 'lib/hooks/usePoolChainValues'

const handleSetRngService = async (
  sendTx,
  txName,
  setTx,
  prizeStrategyAddress,
  rngServiceAddress
) => {
  const params = [rngServiceAddress]

  await sendTx(setTx, prizeStrategyAddress, PrizeStrategyAbi, 'setRngService', txName, params)
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
  const sendTx = useSendTransaction()

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
      sendTx,
      txName,
      setTx,
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
