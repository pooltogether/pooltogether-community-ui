import React from 'react'

import { AwardPrizeCard } from 'lib/components/AwardPrizeCard'
import { Card } from 'lib/components/Card'
import { Collapse } from 'lib/components/Collapse'
import { DepositUI } from 'lib/components/DepositUI'
import { PrizeCard } from 'lib/components/PrizeCard'
import { WithdrawUI } from 'lib/components/WithdrawUI'
import { RelativeNavLinks } from 'lib/components/RelativeNavLinks'
import { PoolDepositorStatsCard } from 'lib/components/PoolStats'
import { useTimeLeftBeforePrize } from 'lib/hooks/useTimeLeftBeforePrize'

export const DepositorUI = (props) => {
  const { timeRemaining } = useTimeLeftBeforePrize()

  return (
    <>
      <PrizeCard className='mb-4' />
      {!timeRemaining && <AwardPrizeCard />}
      <Card>
        <Collapse title='Deposit to win' openOnMount>
          <DepositUI />
        </Collapse>
      </Card>
      <PoolDepositorStatsCard />
      <Card>
        <Collapse title='Withdraw'>
          <WithdrawUI />
        </Collapse>
      </Card>

      <RelativeNavLinks />
    </>
  )
}
