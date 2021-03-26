import React, { useContext, useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import PrizeStrategyAbi from '@pooltogether/pooltogether-contracts/abis/MultipleWinners'

import { Button } from 'lib/components/Button'
import { Card, CardSecondaryText } from 'lib/components/Card'
import { Collapse } from 'lib/components/Collapse'
import { poolAddressesAtom } from 'lib/hooks/usePoolAddresses'
import { sendTx } from 'lib/utils/sendTx'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { TxMessage } from 'lib/components/TxMessage'
import { poolChainValuesAtom } from 'lib/hooks/usePoolChainValues'
import { TextInputGroup } from 'lib/components/TextInputGroup'
import { ConnectWalletButton } from 'lib/components/ConnectWalletButton'
import { usersAddressAtom } from 'lib/hooks/useUsersAddress'
import { contractVersionsAtom } from 'lib/hooks/useDetermineContractVersions'
import { useNetwork } from 'lib/hooks/useNetwork'

const handleSetNumberOfWinners = async (
  txName,
  setTx,
  provider,
  prizeStrategyAddress,
  numOfWinners
) => {
  const params = [
    numOfWinners,
    {
      gasLimit: 200000
    }
  ]

  await sendTx(
    setTx,
    provider,
    prizeStrategyAddress,
    PrizeStrategyAbi,
    'setNumberOfWinners',
    params,
    txName
  )
}

export const NumOfWinnersControlCard = (props) => {
  const [contractVersions] = useAtom(contractVersionsAtom)

  if (contractVersions.prizeStrategy.contract === 'SingleRandomWinner') {
    return (
      <Card>
        <Collapse title='Number of winners'>
          <CardSecondaryText className='mb-4'>
            A single random winner Prize Strategy was selected for this Prize Pool. There will be 1
            winner for the entire prize .
          </CardSecondaryText>
        </Collapse>
      </Card>
    )
  }

  return (
    <Card>
      <Collapse title='Number of winners'>
        <CardSecondaryText className='mb-8'>
          Alter the number of winners to split the prize between.
        </CardSecondaryText>
        <NumOfWinnersForm />
      </Collapse>
    </Card>
  )
}

const NumOfWinnersForm = (props) => {
  const [poolAddresses, setPoolAddresses] = useAtom(poolAddressesAtom)
  const [poolChainValues, setPoolChainValues] = useAtom(poolChainValuesAtom)
  const [usersAddress] = useAtom(usersAddressAtom)
  const [tx, setTx] = useState({})
  const { walletMatchesNetwork } = useNetwork()
  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider

  const currentNumOfWinners = poolChainValues.numberOfWinners

  const [newNumOfWinners, setNewNumOfWinners] = useState(currentNumOfWinners)

  // Listen for external updates
  useEffect(() => {
    setNewNumOfWinners(currentNumOfWinners)
  }, [currentNumOfWinners])

  const txName = 'Set Number of winners'

  const handleSubmit = (e) => {
    e.preventDefault()
    handleSetNumberOfWinners(txName, setTx, provider, poolAddresses.prizeStrategy, newNumOfWinners)
  }

  // Update local data upon completion
  useEffect(() => {
    if (tx.completed && !tx.error) {
      setPoolChainValues({
        ...poolChainValues,
        numberOfWinners: newNumOfWinners
      })
    }
  }, [tx.completed, tx.error])

  const resetState = (e) => {
    e.preventDefault()

    setNewNumOfWinners(currentNumOfWinners)
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
      <div className='flex flex-col sm:flex-row mb-4'>
        <TextInputGroup
          id='newNumOfWinners'
          name='newNumOfWinners'
          label='Number of winners'
          containerClassName='w-full sm:w-1/2 sm:mr-2'
          placeholder='(eg. 0x1f9840a85d5af5bf1d1762f925bdaddc4201f984)'
          onChange={(e) => {
            setNewNumOfWinners(e.target.value)
          }}
          value={newNumOfWinners}
        />
      </div>
      <Button color='secondary' size='lg' disabled={!walletMatchesNetwork}>
        Update winners
      </Button>
    </form>
  )
}
