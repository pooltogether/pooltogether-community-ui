import { useAtom } from 'jotai'
import { Card, CardPrimaryText, CardTitle } from 'lib/components/Card'
import { poolChainValuesAtom } from 'lib/hooks/usePoolChainValues'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import React from 'react'

export const ExitFeeCards = (props) => {
  return (
    <div className='flex'>
      <EarlyExitFeeCard />
      <SponsorshipCard />
    </div>
  )
}

const EarlyExitFeeCard = () => {
  const [poolChainValues] = useAtom(poolChainValuesAtom)
  const maxExitFee = displayAmountInEther(poolChainValues.maxExitFeeMantissa.mul(100), {
    precision: 2
  })

  return (
    <Card className='mr-4'>
      <CardTitle>Max exit fee</CardTitle>
      <CardPrimaryText>{`${maxExitFee}%`}</CardPrimaryText>
    </Card>
  )
}
const SponsorshipCard = () => {
  const [poolChainValues] = useAtom(poolChainValuesAtom)

  return (
    <Card className='ml-4'>
      <CardTitle>Exit fee decay time</CardTitle>
      <CardPrimaryText>{`decay time`}</CardPrimaryText>
    </Card>
  )
}
