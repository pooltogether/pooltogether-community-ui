import React from 'react'

import { Card, CardPrimaryText, CardSecondaryTitle } from 'lib/components/Card'
import { getCreditMaturationDaysAndLimitPercentage } from 'lib/utils/format'
import { usePoolChainValues } from 'lib/hooks/usePoolChainValues'

export const ExitFeeCards = () => {
  const { data: poolChainValues } = usePoolChainValues()

  const [creditMaturationInDays, creditLimitPercentage] = getCreditMaturationDaysAndLimitPercentage(
    poolChainValues.config.ticketCreditRateMantissa,
    poolChainValues.config.ticketCreditLimitMantissa
  )

  return (
    <div className='flex'>
      <Card className='mr-1 sm:mr-4'>
        <CardSecondaryTitle>Early exit fee</CardSecondaryTitle>
        <CardPrimaryText>{`${creditLimitPercentage}%`}</CardPrimaryText>
      </Card>
      <Card className='ml-1 sm:ml-4'>
        <CardSecondaryTitle>Exit fee decay time</CardSecondaryTitle>
        <CardPrimaryText>{`${creditMaturationInDays} day${
          creditMaturationInDays === 1 ? '' : 's'
        }`}</CardPrimaryText>
      </Card>
    </div>
  )
}
