import React, { useContext, useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import OwnableUpgradeableAbi from '@pooltogether/pooltogether-contracts/abis/OwnableUpgradeable'

import { Button } from 'lib/components/Button'
import { Card, CardSecondaryText } from 'lib/components/Card'
import { Collapse } from 'lib/components/Collapse'
import { DAYS_STEP, MAX_EXIT_FEE_PERCENTAGE } from 'lib/constants'
import { poolAddressesAtom } from 'lib/hooks/usePoolAddresses'
import { sendTx } from 'lib/utils/sendTx'
import { errorStateAtom } from 'lib/components/PoolData'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { TxMessage } from 'lib/components/TxMessage'
import { TextInputGroup, TextInputGroupType } from 'lib/components/TextInputGroup'
import {
  getCreditMaturationDaysAndLimitPercentage,
  getCreditRateMantissaAndLimitMantissa
} from 'lib/utils/format'
import { fetchPoolChainValues, poolChainValuesAtom } from 'lib/hooks/usePoolChainValues'
import { usersAddressAtom } from 'lib/hooks/useUsersAddress'
import { ConnectWalletButton } from 'lib/components/ConnectWalletButton'
import { contractVersionsAtom, prizePoolTypeAtom } from 'lib/hooks/useDetermineContractVersions'
import { EtherscanAddressLink } from 'lib/components/EtherscanAddressLink'

const handleTransferOwnership = async (txName, setTx, provider, prizePoolAddress, address) => {
  const params = [
    address,
    {
      gasLimit: 200000
    }
  ]

  await sendTx(
    setTx,
    provider,
    prizePoolAddress,
    OwnableUpgradeableAbi,
    'transferOwnership',
    params,
    txName
  )
}

export const OwnershipControlCard = (props) => {
  const [poolChainValues, setPoolChainValues] = useAtom(poolChainValuesAtom)

  return (
    <Card>
      <Collapse title='Ownership'>
        <div className='text-sm sm:text-base text-accent-1 mb-2'>
          Transfer ownership of the Prize Pool contract to another address.
        </div>
        <div className='text-sm sm:text-base text-accent-1 mb-8'>
          Current Prize Pool owner:
          <EtherscanAddressLink size='xxs' address={poolChainValues.owner} className='ml-4'>
            {poolChainValues.owner}
          </EtherscanAddressLink>
        </div>
        <OwnershipControlForm />
      </Collapse>
    </Card>
  )
}

const OwnershipControlForm = (props) => {
  const [poolAddresses, setPoolAddresses] = useAtom(poolAddressesAtom)
  const [poolChainValues, setPoolChainValues] = useAtom(poolChainValuesAtom)
  const [prizePoolType] = useAtom(prizePoolTypeAtom)
  const [contractVersions] = useAtom(contractVersionsAtom)
  const [errorState, setErrorState] = useAtom(errorStateAtom)
  const [usersAddress] = useAtom(usersAddressAtom)
  const [tx, setTx] = useState({})
  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider

  const [newOwnerAddress, setNewOwnerAddress] = useState('')

  const txName = 'Transfer Ownership'

  const handleSubmit = (e) => {
    e.preventDefault()

    handleTransferOwnership(txName, setTx, provider, poolAddresses.prizePool, newOwnerAddress)
  }

  // Update local data upon completion
  useEffect(() => {
    if (tx.completed && !tx.error) {
      fetchPoolChainValues(
        provider,
        poolAddresses,
        prizePoolType,
        setPoolChainValues,
        contractVersions.prizeStrategy.contract,
        setErrorState
      )
    }
  }, [tx.completed, tx.error])

  const resetState = (e) => {
    e.preventDefault()
    setTx({})
  }

  if (!usersAddress) {
    return <ConnectWalletButton />
  }

  if (tx.inWallet || tx.sent || tx.completed) {
    return <TxMessage txType={txName} tx={tx} handleReset={resetState} />
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className='flex flex-col sm:flex-row sm:mb-4'>
        <TextInputGroup
          id='_newOwnerAddress'
          containerClassName='w-full sm:w-1/2 sm:mr-2'
          label={`New owner's address`}
          required
          type={TextInputGroupType.text}
          max={MAX_EXIT_FEE_PERCENTAGE}
          onChange={(e) => {
            setNewOwnerAddress(e.target.value)
          }}
          value={newOwnerAddress}
        />
      </div>
      <Button color='secondary' size='lg'>
        Transfer Ownership
      </Button>
    </form>
  )
}
