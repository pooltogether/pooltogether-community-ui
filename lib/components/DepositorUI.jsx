import React from 'react'

import { Card } from 'lib/components/Card'
import { Collapse } from 'lib/components/Collapse'
import { DepositUI } from 'lib/components/DepositUI'
import { PrizeCard } from 'lib/components/PrizeCard'
import { WithdrawUI } from 'lib/components/WithdrawUI'
import { DepositorOddsCards } from 'lib/components/DepositorOddsCards'

export const DepositorUI = (props) => {
  console.log('depositor render')

  return (
    <>
      <PrizeCard className='mb-4' />
      <DepositorOddsCards />
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
    </>
  )
}
