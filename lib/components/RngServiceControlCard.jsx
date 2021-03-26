import React, { useContext, useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import PrizeStrategyAbi from '@pooltogether/pooltogether-contracts/abis/PeriodicPrizeStrategy'

import { Button } from 'lib/components/Button'
import { Card, CardSecondaryText } from 'lib/components/Card'
import { Collapse } from 'lib/components/Collapse'
import { DropdownInputGroup } from 'lib/components/DropdownInputGroup'
import { CONTRACT_ADDRESSES } from 'lib/constants'
import { useNetwork } from 'lib/hooks/useNetwork'
import { poolAddressesAtom } from 'lib/hooks/usePoolAddresses'
import { sendTx } from 'lib/utils/sendTx'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { TxMessage } from 'lib/components/TxMessage'
import { usersAddressAtom } from 'lib/hooks/useUsersAddress'
import { ConnectWalletButton } from 'lib/components/ConnectWalletButton'

const handleSetRngService = async (
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
  const [poolAddresses, setPoolAddresses] = useAtom(poolAddressesAtom)
  const [usersAddress] = useAtom(usersAddressAtom)
  const { chainId, walletMatchesNetwork } = useNetwork()
  const [tx, setTx] = useState({})
  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider

  const rngServicesList = Object.keys(CONTRACT_ADDRESSES[chainId].RNG_SERVICE)
  const currentRngService = rngServicesList.find(
    (service) => CONTRACT_ADDRESSES[chainId].RNG_SERVICE[service] === poolAddresses.rng
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
      txName,
      setTx,
      provider,
      poolAddresses.prizeStrategy,
      CONTRACT_ADDRESSES[chainId].RNG_SERVICE[newRngService]
    )
  }

  // Update local data upon completion
  useEffect(() => {
    if (tx.completed && !tx.error) {
      setPoolAddresses({
        ...poolAddresses,
        rng: CONTRACT_ADDRESSES[chainId].RNG_SERVICE[newRngService]
      })
    }
  }, [tx.completed, tx.error])

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
