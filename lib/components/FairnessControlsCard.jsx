import React, { useContext, useEffect, useState } from 'react'
import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'

import { Button } from 'lib/components/Button'
import { Card, CardSecondaryText } from 'lib/components/Card'
import { Collapse } from 'lib/components/Collapse'
import { DAYS_STEP, MAX_EXIT_FEE_PERCENTAGE } from 'lib/constants'
import { sendTx } from 'lib/utils/sendTx'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { TxMessage } from 'lib/components/TxMessage'
import { TextInputGroup, TextInputGroupType } from 'lib/components/TextInputGroup'
import {
  getCreditMaturationDaysAndLimitPercentage,
  getCreditRateMantissaAndLimitMantissa
} from 'lib/utils/format'
import { ConnectWalletButton } from 'lib/components/ConnectWalletButton'
import { useNetwork } from 'lib/hooks/useNetwork'
import { usePrizePoolContracts } from 'lib/hooks/usePrizePoolContracts'
import { usePoolChainValues } from 'lib/hooks/usePoolChainValues'
import { useUsersAddress } from 'lib/hooks/useUsersAddress'
import { useOnTransactionCompleted } from 'lib/hooks/useOnTransactionCompleted'

const handleSetCreditPlan = async (
  walletMatchesNetwork,
  txName,
  setTx,
  provider,
  prizePoolAddress,
  controlledTokenAddress,
  creditRateMantissa,
  creditLimitMantissa
) => {
  const params = [
    controlledTokenAddress,
    creditRateMantissa,
    creditLimitMantissa,
    {
      gasLimit: 200000
    }
  ]

  await sendTx(
    walletMatchesNetwork,
    setTx,
    provider,
    prizePoolAddress,
    PrizePoolAbi,
    'setCreditPlanOf',
    params,
    txName
  )
}

export const FairnessControlsCard = (props) => {
  return (
    <Card>
      <Collapse title='Fairness'>
        <div className='font-bold mb-2 sm:mb-6 text-base sm:text-xl text-accent-1'>
          Early exit fee & fee decay time
        </div>
        <CardSecondaryText className='mb-8'>
          When a user deposits, they are instantly eligible to win. To maintain fairness a time
          decay early exit is enforced. All early exit fees accrue to the prize.
        </CardSecondaryText>
        <FairnessControlsForm />
      </Collapse>
    </Card>
  )
}

const FairnessControlsForm = (props) => {
  const [tx, setTx] = useState({})
  const { data: prizePoolContracts } = usePrizePoolContracts()
  const { data: poolChainValues, refetch: refetchPoolChainValues } = usePoolChainValues()
  const [usersAddress] = useUsersAddress()
  const { walletMatchesNetwork } = useNetwork()
  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider
  const [creditMaturationInDays, creditLimitPercentage] = getCreditMaturationDaysAndLimitPercentage(
    poolChainValues.config.ticketCreditRateMantissa,
    poolChainValues.config.ticketCreditLimitMantissa
  )
  const [ticketCreditMaturationInDays, setTicketCreditMaturationInDays] = useState(
    creditMaturationInDays
  )
  const [ticketCreditLimitPercentage, setTicketCreditLimitPercentage] = useState(
    creditLimitPercentage
  )

  const txName = 'Set Credit Plan'

  const handleSubmit = (e) => {
    e.preventDefault()

    const [
      ticketCreditRateMantissa,
      ticketCreditLimitMantissa
    ] = getCreditRateMantissaAndLimitMantissa(
      ticketCreditMaturationInDays,
      ticketCreditLimitPercentage
    )

    handleSetCreditPlan(
      walletMatchesNetwork,
      txName,
      setTx,
      provider,
      prizePoolContracts.prizePool.address,
      prizePoolContracts.ticket.address,
      ticketCreditRateMantissa,
      ticketCreditLimitMantissa
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
      <div className='flex flex-col sm:flex-row sm:mb-4'>
        <TextInputGroup
          id='_ticketCreditLimitPercentage'
          containerClassName='w-full sm:w-1/2 sm:mr-2'
          label='Early exit fee'
          required
          type={TextInputGroupType.number}
          max={MAX_EXIT_FEE_PERCENTAGE}
          min={0}
          step={1}
          onChange={(e) => {
            setTicketCreditLimitPercentage(e.target.value)
          }}
          value={ticketCreditLimitPercentage}
          unit='% percent'
        />

        <TextInputGroup
          id='_ticketCreditMaturationInDays'
          containerClassName='w-full sm:w-1/2 sm:ml-2'
          label='Fee decay time'
          required
          type={TextInputGroupType.number}
          max={21}
          min={0}
          step={DAYS_STEP}
          onChange={(e) => {
            setTicketCreditMaturationInDays(e.target.value)
          }}
          value={ticketCreditMaturationInDays}
          unit='days'
        />
      </div>
      <Button color='secondary' size='lg' disabled={!walletMatchesNetwork}>
        Update fairness rules
      </Button>
    </form>
  )
}
