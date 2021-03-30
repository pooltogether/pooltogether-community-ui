import React from 'react'

import { Card } from 'lib/components/Card'
import { Collapse } from 'lib/components/Collapse'
import { DepositUI } from 'lib/components/DepositUI'
import { PrizeCard } from 'lib/components/PrizeCard'
import { WithdrawUI } from 'lib/components/WithdrawUI'
import { DepositorOddsCards } from 'lib/components/DepositorOddsCards'
import { RelativeInternalLink } from 'lib/components/RelativeInternalLink'
import { PoolDepositorStats } from 'lib/components/PoolStats'

export const DepositorUI = (props) => {
  return (
    <>
      <PrizeCard className='mb-4' />
      {/* <DepositorOddsCards /> */}
      <PoolDepositorStats />
      <Card>
        <Collapse title='Deposit to win' openOnMount>
          <DepositUI />
        </Collapse>
      </Card>
      <Card>
        <Collapse title='Withdraw'>
          <WithdrawUI />
        </Collapse>
      </Card>
      <div className='flex justify-center'>
        <RelativeInternalLink link='/manage'>View Pool Details</RelativeInternalLink>
      </div>
    </>
  )
}
