import { useAtom } from 'jotai'
import { Card, CardPrimaryText, CardSecondaryText, CardTitle } from 'lib/components/Card'
import { poolChainValuesAtom } from 'lib/hooks/usePoolChainValues'
import React from 'react'

export const TicketCards = (props) => {
  return (
    <div className='flex'>
      <TicketCard />
      <SponsorshipCard />
    </div>
  )
}

const TicketCard = () => {
  const [poolChainValues] = useAtom(poolChainValuesAtom)

  return (
    <Card className='mr-4'>
      <CardTitle>Sponsorship symbol & name</CardTitle>
      <CardPrimaryText>{`$${poolChainValues.sponsorshipSymbol}`}</CardPrimaryText>
      <CardSecondaryText className='text-center'>
        {poolChainValues.sponsorshipName}
      </CardSecondaryText>
    </Card>
  )
}
const SponsorshipCard = () => {
  const [poolChainValues] = useAtom(poolChainValuesAtom)

  return (
    <Card className='ml-4'>
      <CardTitle>Sponsorship symbol & name</CardTitle>
      <CardPrimaryText>{`$${poolChainValues.sponsorshipSymbol}`}</CardPrimaryText>
      <CardSecondaryText className='text-center'>
        {poolChainValues.sponsorshipName}
      </CardSecondaryText>
    </Card>
  )
}
