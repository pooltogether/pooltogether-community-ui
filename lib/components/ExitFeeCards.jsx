import React from 'react'
import { useAtom } from 'jotai'

import { Card, CardPrimaryText, CardTitle } from 'lib/components/Card'
import { poolChainValuesAtom } from 'lib/hooks/usePoolChainValues'
import { getCreditMaturationDaysAndLimitPercentage } from 'lib/utils/format'

export const ExitFeeCards = (props) => {
  const [poolChainValues] = useAtom(poolChainValuesAtom)

  const [creditMaturationInDays, creditLimitPercentage] = getCreditMaturationDaysAndLimitPercentage(
    poolChainValues.ticketCreditRateMantissa,
    poolChainValues.ticketCreditLimitMantissa
  )

  return (
    <div className='flex'>
      <Card className='mr-4'>
        <CardTitle>Early exit fee</CardTitle>
        <CardPrimaryText>{`${creditLimitPercentage}%`}</CardPrimaryText>
      </Card>
      <Card className='ml-4'>
        <CardTitle>Exit fee decay time</CardTitle>
        <CardPrimaryText>{`${creditMaturationInDays} day${
          creditMaturationInDays === 1 ? '' : 's'
        }`}</CardPrimaryText>
      </Card>
    </div>
  )
}
