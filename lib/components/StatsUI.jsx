import React from 'react'

import { PrizeAwardsCard } from 'lib/components/PrizeAwardsCard'
import { TicketCards } from 'lib/components/TicketCards'
import { RelatedAddressesCard } from 'lib/components/RelatedAddressesCard'
import { SablierStreamCard } from 'lib/components/SablierStreamCard'
import { PoolStatsCard } from 'lib/components/PoolStats'

export const StatsUI = (props) => {
  return (
    <>
      <PrizeAwardsCard />
      <SablierStreamCard hideIfNoStream />
      <PoolStatsCard />
      <TicketCards />
      <RelatedAddressesCard />
    </>
  )
}
