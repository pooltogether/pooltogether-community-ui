import React, { useContext, useEffect, useState } from 'react'
import PrizeStrategyAbi from '@pooltogether/pooltogether-contracts/abis/PeriodicPrizeStrategy'
import FeatherIcon from 'feather-icons-react'

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
import { useNetwork } from 'lib/hooks/useNetwork'

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

const handleCancelAward = async (setTx, provider, contractAddress) => {
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
    'cancelAward',
    params,
    'Cancel Award'
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
  const [chainId] = useNetwork()

  const { days, hours, minutes, seconds } = useTimeLeft()
  const timeRemaining = Boolean(days || hours || minutes || seconds)
  const { canCompleteAward, canStartAward, isRngRequested, isRngTimedOut } = poolChainValues
  const showTx = tx.inWallet || tx.sent

  const resetState = (e) => {
    e.preventDefault()
    setTx({})
  }

  const handleStartAwardClick = (e) => {
    e.preventDefault()
    setTxType('Start Award')
    handleStartAwardSubmit(setTx, provider, poolAddresses.prizeStrategy)
  }

  const handleCancelAwardClick = (e) => {
    e.preventDefault()
    setTxType('Cancel Award')
    handleCancelAward(setTx, provider, poolAddresses.prizeStrategy)
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
        chainId,
        poolAddresses,
        prizePoolType,
        setPoolChainValues,
        contractVersions.prizeStrategy.contract,
        setErrorState
      )
    }
  }, [timeRemaining, tx.completed])

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
            className='mr-2 my-auto w-3 h-3 sm:w-4 sm:h-4 my-auto stroke-current'
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
          disabled={showTx}
        >
          Cancel award
        </Button>
      </>
    )
  }

  return (
    <>
      {timeRemaining && (
        <TimeDisplay days={days} hours={hours} minutes={minutes} seconds={seconds} />
      )}
      {isRngRequested && !canCompleteAward && (
        <div className='flex'>
          <FeatherIcon
            icon='lock'
            className='mr-2 my-auto w-3 h-3 sm:w-4 sm:h-4 my-auto stroke-current'
          />
          Pool is locked. Awarding in progress!
        </div>
      )}

      <div className='flex flex-col sm:flex-row mt-4'>
        <Button
          type='button'
          disabled={!canStartAward || timeRemaining}
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
          disabled={!canCompleteAward}
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
