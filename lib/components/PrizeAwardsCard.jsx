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

  console.log(awards)

  return <Table headers={['Value', 'Token name', 'Ticker']} rows={rows} />
}

const Row = (props) => {
  const { formattedBalance, symbol, name } = props.award

  return (
    <tr>
      <RowDataCell first>{formattedBalance}</RowDataCell>
      <RowDataCell>{name}</RowDataCell>
      <RowDataCell>{symbol}</RowDataCell>
    </tr>
  )
}
