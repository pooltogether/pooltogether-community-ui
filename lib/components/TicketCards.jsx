import React from 'react'

import { Card, CardPrimaryText, CardSecondaryText, CardSecondaryTitle } from 'lib/components/Card'
import { usePoolChainValues } from 'lib/hooks/usePoolChainValues'

export const TicketCards = (props) => {
  return (
    <div className='flex'>
      <TicketCard />
      <SponsorshipCard />
    </div>
  )
}

const TicketCard = () => {
  const { data: poolChainValues } = usePoolChainValues()

  return (
    <Card className='mr-1 sm:mr-4'>
      <CardSecondaryTitle>Ticket symbol & name</CardSecondaryTitle>
      <CardPrimaryText>{`$${poolChainValues.ticket.symbol}`}</CardPrimaryText>
      <CardSecondaryText className='text-center'>{poolChainValues.ticket.name}</CardSecondaryText>
    </Card>
  )
}
const SponsorshipCard = () => {
  const { data: poolChainValues } = usePoolChainValues()

  return (
    <Card className='ml-1 sm:ml-4'>
      <CardSecondaryTitle>Sponsorship symbol & name</CardSecondaryTitle>
      <CardPrimaryText>{`$${poolChainValues.sponsorship.symbol}`}</CardPrimaryText>
      <CardSecondaryText className='text-center'>
        {poolChainValues.sponsorship.name}
      </CardSecondaryText>
    </Card>
  )
}
