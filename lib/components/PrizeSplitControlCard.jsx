import React, { useEffect, useState } from 'react'
import { constants } from 'ethers'
import { intersectionWith, isEqual } from 'lodash'
import PrizeStrategyAbi from '@pooltogether/pooltogether-contracts/abis/MultipleWinners'
import { isValidAddress } from '@pooltogether/utilities'
import { poolToast } from 'lib/utils/poolToast'
import { useUsersAddress, useOnboard } from '@pooltogether/hooks'

import { Button } from 'lib/components/Button'
import useCounter from 'lib/hooks/useCounter'
import { Card, CardSecondaryText } from 'lib/components/Card'
import { Collapse } from 'lib/components/Collapse'
import { TxMessage } from 'lib/components/TxMessage'
import { usePoolChainValues } from 'lib/hooks/usePoolChainValues'
import { TextInputGroup, TextInputGroupType } from 'lib/components/TextInputGroup'
import { DropdownInputGroup } from 'lib/components/DropdownInputGroup'
import { ConnectWalletButton } from 'lib/components/ConnectWalletButton'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { usePrizePoolContracts } from 'lib/hooks/usePrizePoolContracts'
import { idx } from 'lib/utils/idx'
import { useNetwork } from 'lib/hooks/useNetwork'
import { useOnTransactionCompleted } from 'lib/hooks/useOnTransactionCompleted'

const convertPercentageToSingleDecimalPrecision = (value) => {
  return Number(value) * 10
}

/**
 * @name convertFormToPrizeSplitConfig
 * @description Convert form input to smart contract inputs
 * @param {*} prizeSplit
 */
const convertFormToPrizeSplitConfig = (prizeSplit) => {
  return {
    ...prizeSplit,
    percentage: prizeSplit.percentage * 10
  }
}

/**
 * @name convertFormToPrizeSplitsConfig
 * @description Convert form input to smart contract inputs
 * @param {*} prizeSplit1Target
 */
const convertFormToPrizeSplitsConfig = async (
  { count, provider, poolToast },
  prizeSplit1Target,
  prizeSplit1Percentage,
  prizeSplit1Token,
  prizeSplit2Target,
  prizeSplit2Percentage,
  prizeSplit2Token
) => {
  const prizeSplitMerged = []

  if (isValidAddress(prizeSplit1Target) && prizeSplit1Target != constants.AddressZero) {
    prizeSplitMerged.push({
      target: prizeSplit1Target,
      percentage: convertPercentageToSingleDecimalPrecision(prizeSplit1Percentage),
      token: prizeSplit1Token
    })
  } else if (prizeSplit1Target && prizeSplit1Target != constants.AddressZero) {
    try {
      const ensResolved = await provider.getResolver(prizeSplit1Target)
      prizeSplitMerged.push({
        target: ensResolved.address,
        percentage: convertPercentageToSingleDecimalPrecision(prizeSplit1Percentage),
        token: prizeSplit1Token
      })
    } catch (error) {
      poolToast.error(`First Prize Split: Unable to resolve ENS address`)
      return
    }
  }

  if (
    count == 2 &&
    isValidAddress(prizeSplit2Target) &&
    prizeSplit2Target != constants.AddressZero
  ) {
    prizeSplitMerged.push({
      target: prizeSplit2Target,
      percentage: convertPercentageToSingleDecimalPrecision(prizeSplit2Percentage),
      token: prizeSplit2Token
    })
  } else if (count == 2 && prizeSplit2Target && prizeSplit2Target != constants.AddressZero) {
    try {
      const ensResolved = await provider.getResolver(prizeSplit2Target)
      prizeSplitMerged.push({
        target: ensResolved.address,
        percentage: convertPercentageToSingleDecimalPrecision(prizeSplit2Percentage),
        token: prizeSplit2Token
      })
    } catch (error) {
      poolToast.error(`Second Prize Split: Unable to resolve ENS address`)
      return
    }
  }

  return prizeSplitMerged
}

/**
 * @name handleSetPrizeSplit
 * @param {*} sendTx
 * @param {*} txName
 * @param {*} setTx
 * @param {*} prizeStrategyAddress
 * @param {*} prizeSplit
 * @param {*} prizeSplitIndex
 */
const setPrizeSplit = async (
  sendTx,
  txName,
  setTx,
  prizeStrategyAddress,
  prizeSplit,
  prizeSplitIndex
) => {
  const params = [prizeSplit, prizeSplitIndex]
  await sendTx(setTx, prizeStrategyAddress, PrizeStrategyAbi, 'setPrizeSplit', txName, params)
}

/**
 * @name handleSetPrizeSplits
 * @param {*} sendTx
 * @param {*} txName
 * @param {*} setTx
 * @param {*} prizeStrategyAddress
 * @param {*} prizeSplits
 */
const handleSetPrizeSplits = async (sendTx, txName, setTx, prizeStrategyAddress, prizeSplits) => {
  const params = [prizeSplits]
  await sendTx(setTx, prizeStrategyAddress, PrizeStrategyAbi, 'setPrizeSplits', txName, params)
}

/**
 * @name PrizeSplitControlCard
 * @description A display card for managing the PrizeSplit configuration.
 * @param {*} props
 */
export const PrizeSplitControlCard = (props) => {
  const { data: prizePoolContracts } = usePrizePoolContracts()

  if (prizePoolContracts.prizeStrategy.contract === 'SingleRandomWinner') {
    return (
      <Card>
        <Collapse title='Prize Split'>
          <CardSecondaryText className='mb-4'>
            Prize splits unavailable in single winner prize strategies.
          </CardSecondaryText>
        </Collapse>
      </Card>
    )
  }

  return (
    <Card>
      <Collapse title='Prize Split'>
        <CardSecondaryText className='mb-8'>
          The pool owner can decide a fixed percent of the interest accrued on every prize to go to
          a specific address. You can add up to two additional awards.
        </CardSecondaryText>
        <PrizeSplitForm />
      </Collapse>
    </Card>
  )
}

const PrizeSplitForm = (props) => {
  const [tx, setTx] = useState({})
  const counter = useCounter(1, { min: 0, max: 2 })
  const { data: prizePoolContracts } = usePrizePoolContracts()
  const { data: poolChainValues, refetch: refetchPoolChainValues } = usePoolChainValues()
  const usersAddress = useUsersAddress()
  const { walletMatchesNetwork } = useNetwork()
  const currentNumOfWinners = poolChainValues.config.numberOfWinners
  const [newNumOfWinners, setNewNumOfWinners] = useState(currentNumOfWinners)
  const sendTx = useSendTransaction()
  const { provider } = useOnboard()

  const txName = 'Set PrizeStrategy prize split'
  console.log(poolChainValues, 'PrizeSplitForm')

  useEffect(() => {
    if (idx(poolChainValues, (_) => _.prize.prizeSplits)) {
      counter.set(poolChainValues.prize.prizeSplits.length)
    }
  }, [poolChainValues])

  // Form Value State
  const [prizeSplit1Target, setPrizeSplit1Target] = useState(
    idx(poolChainValues, (_) => _.prize.prizeSplits[0].target || constants.AddressZero)
  )
  const [prizeSplit1Percentage, setPrizeSplit1Percentage] = useState(
    idx(poolChainValues, (_) => _.prize.prizeSplits[0].percentage / 10 || 0)
  )

  const [prizeSplit1TokenType, setPrizeSplit1TokenType] = useState(
    `${idx(poolChainValues, (_) => _.prize.prizeSplits[0].token)}`
  )

  const [prizeSplit2Target, setPrizeSplit2Target] = useState(
    idx(poolChainValues, (_) => _.prize.prizeSplits[1].target || constants.AddressZero)
  )
  const [prizeSplit2Percentage, setPrizeSplit2Percentage] = useState(
    idx(poolChainValues, (_) => _.prize.prizeSplits[1].percentage / 10 || '1')
  )

  const [prizeSplit2TokenType, setPrizeSplit2TokenType] = useState(
    `${idx(poolChainValues, (_) => _.prize.prizeSplits[1].token)}`
  )

  const [isPrizeSplitTouched, setIsPrizeSplitTouched] = useState(false)
  useEffect(() => {
    if (idx(poolChainValues, (_) => _.prize.prizeSplits)) {
      const prizeSplitsChain = [
        {
          target: idx(poolChainValues, (_) => _.prize.prizeSplits[0].target),
          percentage: idx(poolChainValues, (_) => _.prize.prizeSplits[0].percentage),
          token: `${idx(poolChainValues, (_) => _.prize.prizeSplits[0].token)}`
        },
        {
          target: idx(poolChainValues, (_) => _.prize.prizeSplits[1].target),
          percentage: idx(poolChainValues, (_) => _.prize.prizeSplits[1].percentage),
          token: `${idx(poolChainValues, (_) => _.prize.prizeSplits[1].token)}`
        }
      ]

      const prizeSplitsConfig = [
        {
          target: prizeSplit1Target,
          percentage: convertPercentageToSingleDecimalPrecision(prizeSplit1Percentage),
          token: prizeSplit1TokenType
        },
        {
          target: prizeSplit2Target,
          percentage: convertPercentageToSingleDecimalPrecision(prizeSplit2Percentage),
          token: prizeSplit2TokenType
        }
      ]
      console.log(prizeSplitsChain, prizeSplitsConfig, 'prizeSplitsConfig')
      const prizeSplitTouched = isEqual(prizeSplitsChain, prizeSplitsConfig)
      console.log(prizeSplitTouched, 'isEqual')
      setIsPrizeSplitTouched(prizeSplitTouched)
    }
  }, [
    poolChainValues,
    prizeSplit1Target,
    prizeSplit1Percentage,
    prizeSplit1TokenType,
    prizeSplit2Target,
    prizeSplit2Percentage,
    prizeSplit2TokenType
  ])

  const handleSubmit = async (e) => {
    const prizeSplits = await convertFormToPrizeSplitsConfig(
      { provider, poolToast, count: counter.value },
      prizeSplit1Target,
      prizeSplit1Percentage,
      prizeSplit1TokenType,
      prizeSplit2Target,
      prizeSplit2Percentage,
      prizeSplit2TokenType
    )
    console.log(prizeSplits, 'prizeSplits')
    e.preventDefault()
    handleSetPrizeSplits(
      sendTx,
      txName,
      setTx,
      prizePoolContracts.prizeStrategy.address,
      prizeSplits
    )
  }

  const handleSetPrizeSplit = (prizeSplit, prizeSplitIndex) => {
    setPrizeSplit(
      sendTx,
      txName,
      setTx,
      prizePoolContracts.prizeStrategy.address,
      convertFormToPrizeSplitConfig(prizeSplit),
      prizeSplitIndex
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
      {(counter.value == 1 || counter.value == 2) && (
        <PrizeSplitPosition
          index={0}
          position={1}
          target={prizeSplit1Target}
          percentage={prizeSplit1Percentage}
          setTarget={setPrizeSplit1Target}
          setPercentage={setPrizeSplit1Percentage}
          tokenType={prizeSplit1TokenType}
          setTokenType={setPrizeSplit1TokenType}
          handleSetPrizeSplit={handleSetPrizeSplit}
        />
      )}
      {counter.value == 2 && (
        <PrizeSplitPosition
          index={1}
          position={2}
          target={prizeSplit2Target}
          percentage={prizeSplit2Percentage}
          setTarget={setPrizeSplit2Target}
          setPercentage={setPrizeSplit2Percentage}
          tokenType={prizeSplit2TokenType}
          setTokenType={setPrizeSplit2TokenType}
          handleSetPrizeSplit={handleSetPrizeSplit}
        />
      )}

      <div className='grid grid-cols-1 lg:grid-cols-2 lg:gap-x-10 gap-y-3 lg:gap-y-0 justify-between mt-5 lg:mt-10'>
        <Button
          fullWidth
          disabled={counter.value == 2}
          type='button'
          color='secondary'
          onClick={() => counter.incr(1)}
        >
          Add Additional PrizeSplit
        </Button>
        <Button
          fullWidth
          disabled={counter.value == 0}
          type='button'
          color='danger'
          onClick={() => counter.decr(1)}
        >
          Remove PrizeSplit
        </Button>
      </div>

      <Button
        fullWidth
        color='primary'
        size='lg'
        className='mt-8 w-full'
        disabled={isPrizeSplitTouched}
      >
        Update All Prize Splits
      </Button>
    </form>
  )
}

const PrizeSplitPosition = (props) => {
  const {
    index,
    position,
    target,
    percentage,
    setTarget,
    setPercentage,
    tokenType,
    setTokenType,
    handleSetPrizeSplit
  } = props

  const tokenTypeOptions = {
    0: {
      value: 0,
      label: 'Ticket'
    },
    1: {
      value: 1,
      label: 'Sponsorship'
    }
  }

  const formatValue = (key) => idx(tokenTypeOptions, (_) => _[key].label)

  return (
    <>
      <div className='flex justify-between align-center'>
        <h3 className='font-normal mt-10 mb-5 ml-4 lg:ml-8 text-base lg:text-xl'>
          Additional Prize Split {position}
        </h3>
        <Button
          color='warning'
          type='button'
          className='self-center font-bold rounded-full text-green-1 border border-green-1 hover:text-white hover:bg-lightPurple-1000 text-xxs sm:text-base mt-4 mr-3 pt-2 pb-2 px-3 sm:px-6 trans'
          onClick={() =>
            handleSetPrizeSplit({ target: target, percentage: percentage, token: tokenType }, index)
          }
        >
          Update PrizeSplit
        </Button>
      </div>
      <div className='grid grid-cols-5'>
        <TextInputGroup
          id='_prizeSplitRecipient'
          containerClassName='col-span-3 sm:mr-2'
          textClasses={'text-xs'}
          label='PrizeSplit Recipient'
          required
          type={TextInputGroupType.text}
          max={10}
          min={1}
          step={1}
          onChange={(e) => {
            setTarget(e.target.value)
          }}
          value={target}
          unit='Ξ Address'
        />
        <TextInputGroup
          id='_prizeSplitPercentage'
          containerClassName='col-span-2 sm:ml-2'
          label='PrizeSplit percentage'
          required
          type={TextInputGroupType.number}
          max={100}
          min={1}
          step={0.1}
          onChange={(e) => {
            setPercentage(e.target.value)
          }}
          value={percentage}
          unit='% percent'
        />
      </div>
      <div className=''>
        <DropdownInputGroup
          id='tokenType'
          placeHolder='Token Type'
          label={'PrizeSplit Token Type (i.e. normal ticket or sponsorship ticket)'}
          formatValue={formatValue}
          onValueSet={setTokenType}
          current={tokenType}
          values={tokenTypeOptions}
        />
      </div>
    </>
  )
}
