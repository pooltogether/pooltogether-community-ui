import React, { useContext, useEffect, useState } from 'react'
import PrizeStrategyAbi from '@pooltogether/pooltogether-contracts/abis/PeriodicPrizeStrategy'

import { sendTx } from 'lib/utils/sendTx'
import { fetchPoolChainValues, poolChainValuesAtom } from 'lib/hooks/usePoolChainValues'
import { useAtom } from 'jotai'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { useTimeLeft } from 'lib/hooks/useTimeLeft'
import { poolAddressesAtom } from 'lib/hooks/usePoolAddresses'
import { contractVersionsAtom, prizePoolTypeAtom } from 'lib/hooks/useDetermineContractVersions'
import { errorStateAtom } from 'lib/components/PoolData'
import { Card, CardSecondaryText } from 'lib/components/Card'
import { Collapse } from 'lib/components/Collapse'
import { Button } from 'lib/components/Button'
import { TxMessage } from 'lib/components/TxMessage'
import { LoadingDots } from 'lib/components/LoadingDots'

const handleStartAwardSubmit = async (setTx, provider, contractAddress) => {
  const params = [
    {
      gasLimit: 300000
    }
  ]

  await sendTx(
    setTx,
    provider,
    contractAddress,
    PrizeStrategyAbi,
    'startAward',
    params,
    'Start Award'
  )
}

const handleCompleteAwardSubmit = async (setTx, provider, contractAddress) => {
  const params = [
    {
      gasLimit: 700000
    }
  ]

  await sendTx(
    setTx,
    provider,
    contractAddress,
    PrizeStrategyAbi,
    'completeAward',
    params,
    'Complete Award'
  )
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

const AwardPrizeTrigger = () => {
  const [poolChainValues, setPoolChainValues] = useAtom(poolChainValuesAtom)
  const [poolAddresses] = useAtom(poolAddressesAtom)
  const [prizePoolType] = useAtom(prizePoolTypeAtom)
  const [errorState, setErrorState] = useAtom(errorStateAtom)
  const [contractVersions] = useAtom(contractVersionsAtom)
  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider
  const [tx, setTx] = useState({})
  const [txType, setTxType] = useState('')

  const { days, hours, minutes, seconds } = useTimeLeft()
  const timeRemaining = Boolean(days || hours || minutes || seconds)
  const { canCompleteAward, canStartAward, isRngRequested } = poolChainValues
  const txInFlight = tx.inWallet || (tx.sent && !tx.completed)

  const resetState = (e) => {
    e.preventDefault()
    setTx({})
  }

  const handleStartAwardClick = (e) => {
    e.preventDefault()
    setTxType('Start Award')
    handleStartAwardSubmit(setTx, provider, poolAddresses.prizeStrategy)
  }

  const handleCompleteAwardClick = (e) => {
    e.preventDefault()
    setTxType('Complete Award')
    handleCompleteAwardSubmit(setTx, provider, poolAddresses.prizeStrategy)
  }

  // If countdown has finished, trigger a chain data refetch
  useEffect(() => {
    if (!timeRemaining && tx.completed) {
      fetchPoolChainValues(
        provider,
        poolAddresses,
        prizePoolType,
        setPoolChainValues,
        contractVersions.prizeStrategy.contract,
        setErrorState
      )
    }
  }, [timeRemaining, tx.completed])

  if (txInFlight) {
    return (
      <>
        <TxMessage txType={txType} tx={tx} handleReset={resetState} resetButtonText='Hide this' />
        <div className='flex mt-4'>
          <Button
            type='button'
            disabled={true}
            color='secondary'
            size='lg'
            fullWidth
            className='mr-4'
          >
            Start award
          </Button>
          <Button
            type='button'
            disabled={true}
            color='secondary'
            size='lg'
            fullWidth
            className='ml-4'
          >
            Complete award
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      {timeRemaining && (
        <TimeDisplay days={days} hours={hours} minutes={minutes} seconds={seconds} />
      )}
      {isRngRequested && !canCompleteAward && <span>Pool is locked. Awarding in progress!</span>}
      <div className='flex mt-4'>
        <Button
          type='button'
          disabled={!canStartAward || timeRemaining}
          onClick={handleStartAwardClick}
          color='secondary'
          size='lg'
          fullWidth
          className='mr-4'
        >
          Start award
        </Button>
        <Button
          type='button'
          disabled={!canCompleteAward}
          onClick={handleCompleteAwardClick}
          color='secondary'
          size='lg'
          fullWidth
          className='ml-4'
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
          {days} days {hours} hours
        </span>
      )
    } else {
      return (
        <span>
          {days} days {minutes} minutes
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
