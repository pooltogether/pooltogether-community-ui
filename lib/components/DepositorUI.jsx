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
      <Card>
        <Collapse title='Deposit to win' openOnMount>
          <DepositUI />
        </Collapse>
      </Card>
      <PoolDepositorStats />
      <Card>
        <Collapse title='Withdraw'>
          <WithdrawUI />
        </Collapse>
      </Card>
      <div className='flex justify-between w-3/4 sm:w-1/2 mx-auto'>
        <RelativeInternalLink link='/manage'>View Pool Details</RelativeInternalLink>
        <RelativeInternalLink link='/admin'>Manage Pool</RelativeInternalLink>
      </div>
    </>
  )
}
