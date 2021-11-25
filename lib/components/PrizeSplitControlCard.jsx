import React, { useEffect, useState } from 'react'
import { constants, utils } from 'ethers'
import { isEqual } from 'lodash'
import PrizeStrategyAbi from '@pooltogether/pooltogether-contracts/abis/MultipleWinners'
import { isValidAddress } from '@pooltogether/utilities'
import { poolToast } from 'lib/utils/poolToast'
import { useOnboard } from '@pooltogether/bnc-onboard-hooks'

import { useUsersAddress } from 'lib/hooks/useUsersAddress'
import { Button } from 'lib/components/Button'
import useCounter from 'lib/hooks/useCounter'
import { Card, CardSecondaryText } from 'lib/components/Card'
import { Collapse } from 'lib/components/Collapse'
import { TxMessage } from 'lib/components/TxMessage'
import { TextInputGroup, TextInputGroupType } from 'lib/components/TextInputGroup'
import { DropdownInputGroup } from 'lib/components/DropdownInputGroup'
import { ConnectWalletButton } from 'lib/components/ConnectWalletButton'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { usePrizePoolContracts } from 'lib/hooks/usePrizePoolContracts'
import { usePrizeSplitValues } from 'lib/hooks/usePrizeSplitValues'
import { idx } from 'lib/utils/idx'
import { useOnTransactionCompleted } from 'lib/hooks/useOnTransactionCompleted'

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
 * @name convertPercentageToSingleDecimalPrecision
 * @description Convert 0-100 range to 0-1000 range for single decimal precision.
 * @param {*} value
 */
const convertPercentageToSingleDecimalPrecision = (value) => {
  return Number(value) * 10
}

/**
 * @name convertPercentageToSingleDecimalPrecision
 * @description Create token type options list based off tokens array position.
 * @param {*} ticket
 * @param {*} sponsorship
 * @param {*} tokens
 */
const createTokenTypeOptions = (ticket, sponsorship, tokens) => {
  let tokenTypeOptions = {}
  if (utils.getAddress(ticket) == utils.getAddress(tokens[0])) {
    tokenTypeOptions = {
      0: {
        value: 0,
        label: 'Ticket'
      },
      1: {
        value: 1,
        label: 'Sponsorship'
      }
    }
  } else if (utils.getAddress(sponsorship) == utils.getAddress(tokens[0])) {
    tokenTypeOptions = {
      0: {
        value: 0,
        label: 'Sponsorship'
      },
      1: {
        value: 1,
        label: 'Ticket'
      }
    }
  }
  return tokenTypeOptions
}

/**
 * @name convertFormToPrizeSplitConfig
 * @description Convert form input to smart contract inputs
 * @param {*} prizeSplit
 */
const convertFormToPrizeSplitConfig = async (prizeSplit, { provider, poolToast }) => {
  if (isValidAddress(prizeSplit.target)) {
    return {
      ...prizeSplit,
      percentage: convertPercentageToSingleDecimalPrecision(prizeSplit.percentage)
    }
  } else {
    const ensResolved = await provider.resolveName(prizeSplit.target)
    if (isValidAddress(ensResolved)) {
      return {
        ...prizeSplit,
        target: ensResolved,
        percentage: convertPercentageToSingleDecimalPrecision(prizeSplit.percentage)
      }
    } else {
      poolToast.error(`Update Prize Split: Unable to resolve ENS address`)
    }
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
    const ensResolved = await provider.resolveName(prizeSplit1Target)
    if (isValidAddress(ensResolved)) {
      prizeSplitMerged.push({
        target: ensResolved,
        percentage: convertPercentageToSingleDecimalPrecision(prizeSplit1Percentage),
        token: prizeSplit1Token
      })
    } else {
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
    const ensResolved = await provider.resolveName(prizeSplit2Target)
    if (isValidAddress(ensResolved)) {
      prizeSplitMerged.push({
        target: ensResolved,
        percentage: convertPercentageToSingleDecimalPrecision(prizeSplit2Percentage),
        token: prizeSplit2Token
      })
    } else {
      poolToast.error(`First Prize Split: Unable to resolve ENS address`)
      return
    }
  }

  return prizeSplitMerged
}

/**
 * @name PrizeSplitControlCard
 * @description A display card for managing the PrizeSplit configuration.
 * @param {*} props
 */
export const PrizeSplitControlCard = (props) => {
  const { data: prizePoolContracts } = usePrizePoolContracts()
  const {
    data: prizeSplitsValues,
    refetch: refetchprizeSplitsValues,
    isSuccess
  } = usePrizeSplitValues(
    prizePoolContracts.prizeStrategy.address,
    prizePoolContracts.prizePool.address
  )

  if (isSuccess) {
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
            The pool owner can decide a fixed percent of the interest accrued on every prize to go
            to a specific address. You can add up to two additional awards.
          </CardSecondaryText>
          <PrizeSplitForm
            prizePoolContracts={prizePoolContracts}
            prizeSplitsValues={prizeSplitsValues}
            refetchprizeSplitsValues={refetchprizeSplitsValues}
          />
        </Collapse>
      </Card>
    )
  }
  return null
}

const PrizeSplitForm = (props) => {
  const [tx, setTx] = useState({})
  const counter = useCounter(1, { min: 0, max: 2 })
  const usersAddress = useUsersAddress()
  const sendTx = useSendTransaction()
  const { provider } = useOnboard()

  const { prizePoolContracts, prizeSplitsValues, refetchprizeSplitsValues } = props

  const txName = 'Set PrizeStrategy prize split'

  useEffect(() => {
    if (idx(prizeSplitsValues, (_) => _.prizeSplits)) {
      counter.set(prizeSplitsValues.prizeSplits.length)
    }
  }, [prizeSplitsValues])

  // Form Value State
  const [prizeSplit1Target, setPrizeSplit1Target] = useState(
    idx(prizeSplitsValues, (_) => _.prizeSplits[0].target || constants.AddressZero)
  )
  const [prizeSplit1Percentage, setPrizeSplit1Percentage] = useState(
    idx(prizeSplitsValues, (_) => _.prizeSplits[0].percentage / 10 || 0)
  )

  const [prizeSplit1TokenType, setPrizeSplit1TokenType] = useState(
    `${idx(prizeSplitsValues, (_) => _.prizeSplits[0].token)}`
  )

  const [prizeSplit2Target, setPrizeSplit2Target] = useState(
    idx(prizeSplitsValues, (_) => _.prizeSplits[1].target || constants.AddressZero)
  )
  const [prizeSplit2Percentage, setPrizeSplit2Percentage] = useState(
    idx(prizeSplitsValues, (_) => _.prizeSplits[1].percentage / 10 || '1')
  )

  const [prizeSplit2TokenType, setPrizeSplit2TokenType] = useState(
    `${idx(prizeSplitsValues, (_) => _.prizeSplits[1].token)}`
  )

  const [isPrizeSplitTouched, setIsPrizeSplitTouched] = useState(false)
  useEffect(() => {
    if (idx(prizeSplitsValues, (_) => _.prizeSplits)) {
      const prizeSplitsChain = [
        {
          target: idx(prizeSplitsValues, (_) => _.prizeSplits[0].target),
          percentage: idx(prizeSplitsValues, (_) => _.prizeSplits[0].percentage),
          token: `${idx(prizeSplitsValues, (_) => _.prizeSplits[0].token)}`
        },
        {
          target: idx(prizeSplitsValues, (_) => _.prizeSplits[1].target),
          percentage: idx(prizeSplitsValues, (_) => _.prizeSplits[1].percentage),
          token: `${idx(prizeSplitsValues, (_) => _.prizeSplits[1].token)}`
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
      const prizeSplitTouched = isEqual(prizeSplitsChain, prizeSplitsConfig)
      setIsPrizeSplitTouched(prizeSplitTouched)
    }
  }, [
    prizeSplitsValues,
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
    e.preventDefault()
    handleSetPrizeSplits(
      sendTx,
      txName,
      setTx,
      prizePoolContracts.prizeStrategy.address,
      prizeSplits
    )
  }

  const handleSetPrizeSplit = async (prizeSplit, prizeSplitIndex) => {
    const prizeSplitConfig = await convertFormToPrizeSplitConfig(prizeSplit, {
      provider,
      poolToast
    })

    if (prizeSplitConfig) {
      setPrizeSplit(
        sendTx,
        txName,
        setTx,
        prizePoolContracts.prizeStrategy.address,
        prizeSplitConfig,
        prizeSplitIndex
      )
    }
  }

  const handleRemovePrizeSplit = (index) => {
    if (index == 1) {
      setPrizeSplit1Target(constants.AddressZero)
      setPrizeSplit1Percentage(undefined)
      setPrizeSplit1TokenType(undefined)
    } else {
      setPrizeSplit2Target(constants.AddressZero)
      setPrizeSplit2Percentage(undefined)
      setPrizeSplit2TokenType(undefined)
    }
    counter.decr(1)
  }

  useOnTransactionCompleted(tx, refetchprizeSplitsValues)

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
      {(counter.value == 1 || counter.value == 2) && (
        <PrizeSplitPosition
          prizeSplitsLength={prizeSplitsValues.prizeSplits.length}
          index={0}
          position={1}
          target={prizeSplit1Target}
          percentage={prizeSplit1Percentage}
          setTarget={setPrizeSplit1Target}
          setPercentage={setPrizeSplit1Percentage}
          tokenType={prizeSplit1TokenType}
          setTokenType={setPrizeSplit1TokenType}
          handleSetPrizeSplit={handleSetPrizeSplit}
          provider={provider}
          prizeSplitsValues={prizeSplitsValues}
        />
      )}
      {counter.value == 2 && (
        <PrizeSplitPosition
          prizeSplitsLength={prizeSplitsValues.prizeSplits.length}
          index={1}
          position={2}
          target={prizeSplit2Target}
          percentage={prizeSplit2Percentage}
          setTarget={setPrizeSplit2Target}
          setPercentage={setPrizeSplit2Percentage}
          tokenType={prizeSplit2TokenType}
          setTokenType={setPrizeSplit2TokenType}
          handleSetPrizeSplit={handleSetPrizeSplit}
          provider={provider}
          prizeSplitsValues={prizeSplitsValues}
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
          onClick={() => handleRemovePrizeSplit(counter.value)}
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
    prizeSplitsLength,
    index,
    position,
    target,
    percentage,
    setTarget,
    setPercentage,
    tokenType,
    setTokenType,
    handleSetPrizeSplit,
    prizeSplitsValues
  } = props

  const [isReadyToBeUpdated, setIsReadyToBeUpdated] = useState(false)
  useEffect(() => {
    if (index < prizeSplitsLength && target && percentage && tokenType != 'undefined') {
      setIsReadyToBeUpdated(true)
    }
  }, [target, percentage, tokenType])

  const formatValue = (key) => idx(tokenTypeOptions, (_) => _[key].label)
  const tokenTypeOptions = createTokenTypeOptions(
    prizeSplitsValues.ticket,
    prizeSplitsValues.sponsorship,
    prizeSplitsValues.tokens
  )

  return (
    <>
      <h3 className='font-normal mt-10 mb-5 ml-4 lg:ml-8 text-base lg:text-xl'>
        Additional Prize Split {position}
      </h3>
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
