import React, { useContext, useEffect, useState } from 'react'
import PrizeStrategyAbi from '@pooltogether/pooltogether-contracts/abis/MultipleWinners'

import { Button } from 'lib/components/Button'
import { Card, CardSecondaryText } from 'lib/components/Card'
import { Collapse } from 'lib/components/Collapse'
import { sendTx } from 'lib/utils/sendTx'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { TxMessage } from 'lib/components/TxMessage'
import { usePoolChainValues } from 'lib/hooks/usePoolChainValues'
import { TextInputGroup } from 'lib/components/TextInputGroup'
import { ConnectWalletButton } from 'lib/components/ConnectWalletButton'
import { useUsersAddress } from 'lib/hooks/useUsersAddress'
import { usePrizePoolContracts } from 'lib/hooks/usePrizePoolContracts'
import { useNetwork } from 'lib/hooks/useNetwork'
import { useOnTransactionCompleted } from 'lib/hooks/useOnTransactionCompleted'

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
  const { data: prizePoolContracts } = usePrizePoolContracts()

  if (prizePoolContracts.prizeStrategy.contract === 'SingleRandomWinner') {
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
  const [tx, setTx] = useState({})
  const { data: prizePoolContracts } = usePrizePoolContracts()
  const { data: poolChainValues, refetch: refetchPoolChainValues } = usePoolChainValues()
  const usersAddress = useUsersAddress()
  const { walletMatchesNetwork } = useNetwork()
  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider
  const currentNumOfWinners = poolChainValues.config.numberOfWinners
  const [newNumOfWinners, setNewNumOfWinners] = useState(currentNumOfWinners)

  // Listen for external updates
  useEffect(() => {
    setNewNumOfWinners(currentNumOfWinners)
  }, [currentNumOfWinners])

  const txName = 'Set Number of winners'

  const handleSubmit = (e) => {
    e.preventDefault()
    handleSetNumberOfWinners(
      txName,
      setTx,
      provider,
      prizePoolContracts.prizeStrategy.address,
      newNumOfWinners
    )
  }

  useOnTransactionCompleted(tx, refetchPoolChainValues)

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
