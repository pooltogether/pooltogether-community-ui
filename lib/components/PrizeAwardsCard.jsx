import React, { useMemo } from 'react'

import { Card } from 'lib/components/Card'
import { Collapse } from 'lib/components/Collapse'
import { LoadingDots } from 'lib/components/LoadingDots'
import { useAwardsList } from 'lib/hooks/useAwardsList'
import { RowDataCell, Table } from 'lib/components/Table'

export const PrizeAwardsCard = (props) => {
  return (
    <Card>
      <Collapse title='Current prize details'>
        <PrizeAwardsTable />
      </Collapse>
    </Card>
  )
}

const PrizeAwardsTable = () => {
  const { awards, loading } = useAwardsList()

  const rows = useMemo(() => awards.map((award, index) => <Row key={index} award={award} />), [
    awards
  ])

  if (loading) {
    return (
      <div className='p-10'>
        <LoadingDots />
      </div>
    )
  }

  return <Table headers={['Value', 'Token name', 'Ticker']} rows={rows} className='w-full' />
}

const Row = (props) => {
  const { formattedBalance, symbol, name } = props.award

  if (formattedBalance == 0) return null

  return (
    <tr>
      <RowDataCell first className='font-bold'>
        {formattedBalance}
      </RowDataCell>
      <RowDataCell>{name}</RowDataCell>
      <RowDataCell className='text-accent-1'>{symbol}</RowDataCell>
    </tr>
  )
}
