import React, { useEffect, useState } from 'react'
import FeatherIcon from 'feather-icons-react'
import PrizeStrategyAbi from '@pooltogether/pooltogether-contracts/abis/PeriodicPrizeStrategy'

import { useTimeLeftBeforePrize } from 'lib/hooks/useTimeLeftBeforePrize'
import { Card, CardSecondaryText } from 'lib/components/Card'
import { Collapse } from 'lib/components/Collapse'
import { Button } from 'lib/components/Button'
import { TxMessage } from 'lib/components/TxMessage'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { useNetwork } from 'lib/hooks/useNetwork'
import { usePrizePoolContracts } from 'lib/hooks/usePrizePoolContracts'
import { usePoolChainValues } from 'lib/hooks/usePoolChainValues'
import { useOnTransactionCompleted } from 'lib/hooks/useOnTransactionCompleted'

const handleStartAwardSubmit = async (sendTx, setTx, contractAddress) => {
  await sendTx(setTx, contractAddress, PrizeStrategyAbi, 'startAward', 'Start Award')
}

const handleCompleteAwardSubmit = async (sendTx, setTx, contractAddress) => {
  await sendTx(setTx, contractAddress, PrizeStrategyAbi, 'completeAward', 'Complete Award')
}

const handleCancelAward = async (sendTx, setTx, contractAddress) => {
  await sendTx(setTx, contractAddress, PrizeStrategyAbi, 'cancelAward', 'Cancel Award')
}

export const AwardPrizeCard = () => {
  return (
    <Card>
      <Collapse title='Award Prize'>
        <AwardPrizeTrigger />
      </Collapse>
    </Card>
  )
}

export const AwardPrizeTrigger = (props) => {
  const { hideTimeRemaining } = props

  const { data: prizePoolContracts } = usePrizePoolContracts()
  const { data: poolChainValues, refetch: refetchPoolChainValues } = usePoolChainValues()

  const sendTx = useSendTransaction()
  const [tx, setTx] = useState({})
  const [txType, setTxType] = useState('')
  const { walletMatchesNetwork } = useNetwork()
  const { days, hours, minutes, seconds, timeRemaining } = useTimeLeftBeforePrize()

  const { canCompleteAward, canStartAward, isRngRequested, isRngTimedOut } = poolChainValues.prize
  const showTx = tx.inWallet || tx.sent

  const resetState = (e) => {
    e.preventDefault()
    setTx({})
  }

  const handleStartAwardClick = (e) => {
    e.preventDefault()

    setTxType('Start Award')
    handleStartAwardSubmit(sendTx, setTx, prizePoolContracts.prizeStrategy.address)
  }

  const handleCancelAwardClick = (e) => {
    e.preventDefault()
    setTxType('Cancel Award')
    handleCancelAward(sendTx, setTx, prizePoolContracts.prizeStrategy.address)
  }

  const handleCompleteAwardClick = (e) => {
    e.preventDefault()
    setTxType('Complete Award')
    handleCompleteAwardSubmit(sendTx, setTx, prizePoolContracts.prizeStrategy.address)
  }

  // If countdown has finished, trigger a chain data refetch
  useEffect(() => {
    if (!timeRemaining && tx.completed) {
      refetchPoolChainValues()
    }
  }, [timeRemaining, tx.completed])

  useOnTransactionCompleted(tx, refetchPoolChainValues)

  if (showTx) {
    return (
      <TxMessage
        txType={txType}
        tx={tx}
        handleReset={resetState}
        resetButtonText={txType === 'Start Award' ? 'Next' : 'Hide this'}
      />
    )
  }

  if (isRngTimedOut) {
    return (
      <>
        <div className='flex text-orange-500 font-bold'>
          <FeatherIcon
            icon='alert-triangle'
            className='mr-2 my-auto w-3 h-3 sm:w-4 sm:h-4 stroke-current'
          />
          Attention
        </div>

        <CardSecondaryText className='mb-4 sm:mb-8'>
          The random number generator has timed out. You must cancel the awarding process to unlock
          users funds and start the awarding process again.
        </CardSecondaryText>
        <Button
          type='button'
          onClick={handleCancelAwardClick}
          color='danger'
          size='lg'
          disabled={showTx || !walletMatchesNetwork}
        >
          Cancel award
        </Button>
      </>
    )
  }

  return (
    <>
      {timeRemaining && !hideTimeRemaining && (
        <TimeDisplay days={days} hours={hours} minutes={minutes} seconds={seconds} />
      )}
      {isRngRequested && !canCompleteAward && (
        <div className='flex justify-center'>
          <FeatherIcon icon='lock' className='mr-2 my-auto w-3 h-3 sm:w-4 sm:h-4 stroke-current' />
          Pool is locked as the award process has started. Run 'Complete Award' when it's ready
          (ETA: 5 minutes).
        </div>
      )}

      <div className='flex flex-col sm:flex-row mt-4'>
        <Button
          type='button'
          disabled={!canStartAward || timeRemaining || !walletMatchesNetwork}
          onClick={handleStartAwardClick}
          color='secondary'
          size='lg'
          fullWidth
          className='sm:mr-4 mb-4 sm:mb-0'
        >
          Start award
        </Button>
        <Button
          type='button'
          disabled={!canCompleteAward || !walletMatchesNetwork}
          onClick={handleCompleteAwardClick}
          color='secondary'
          size='lg'
          fullWidth
          className='sm:ml-4'
        >
          Complete award
        </Button>
      </div>
    </>
  )
}

const TimeDisplay = ({ days, hours, minutes, seconds }) => {
  if (days > 0) {
    if (hours > 0) {
      return (
        <span>
          {days} day{days === 1 ? '' : 's'} {hours} hour{hours === 1 ? '' : 's'}
        </span>
      )
    } else {
      return (
        <span>
          {days} day{days === 1 ? '' : 's'} {minutes} minute{minutes === 1 ? '' : 's'}
        </span>
      )
    }
  }

  return (
    <span>
      {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:
      {String(seconds).padStart(2, '0')}
    </span>
  )
}
