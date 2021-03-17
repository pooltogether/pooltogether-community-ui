import React from 'react'

import { PrizeAwardsCard } from 'lib/components/PrizeAwardsCard'
import { PrizeDetailsCards } from 'lib/components/PrizeDetailsCards'
import { ExitFeeCards } from 'lib/components/ExitFeeCards'
import { TicketCards } from 'lib/components/TicketCards'
import { RelatedAddressesCard } from 'lib/components/RelatedAddressesCard'
import { SablierStreamCard } from 'lib/components/SablierStreamCard'

export const StatsUI = (props) => {
  return (
    <>
      <PrizeAwardsCard />
      <SablierStreamCard hideIfNoStream />
      <PrizeDetailsCards />
      <ExitFeeCards />
      <TicketCards />
      <RelatedAddressesCard />
    </>
  )
}
