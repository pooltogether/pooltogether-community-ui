import React, { useMemo } from 'react'
import { Card } from 'lib/components/Card'
import { Collapse } from 'lib/components/Collapse'
import { RowDataCell, Table } from 'lib/components/Table'
import { BlockExplorerLink } from 'lib/components/BlockExplorerLink'
import { CopyIcon } from 'lib/components/CopyIcon'
import { usePrizePoolContracts } from 'lib/hooks/usePrizePoolContracts'

export const RelatedAddressesCard = (props) => {
  const { data: prizePoolContracts } = usePrizePoolContracts()
  const rows = useMemo(() => {
    const rowData = [
      {
        contract: 'Ticket',
        address: prizePoolContracts.ticket.address
      },
      {
        contract: 'Sponsorship',
        address: prizePoolContracts.sponsorship.address
      },
      {
        contract: 'Prize pool',
        address: prizePoolContracts.prizePool.address
      },
      {
        contract: 'Prize strategy',
        address: prizePoolContracts.prizeStrategy.address
      },
      {
        contract: 'ERC20 Token (Underlying)',
        address: prizePoolContracts.token.address
      },
      {
        contract: 'Random Number Generator (RNG)',
        address: prizePoolContracts.rng.address
      }
    ]

    return rowData.map((data, index) => (
      <Row key={index} index={index} contract={data.contract} address={data.address} />
    ))
  }, [prizePoolContracts])

  return (
    <Card>
      <Collapse title='Related contract addresses' openOnMount>
        <Table headers={['Contract', 'Address']} rows={rows} className='w-full table-auto' />
      </Collapse>
    </Card>
  )
}

const Row = (props) => {
  const { contract, address } = props

  return (
    <tr>
      <RowDataCell first className='font-bold'>
        {contract}
      </RowDataCell>
      <RowDataCell>
        <BlockExplorerLink
          address={address}
          className='text-xs sm:text-base text-accent-1'
          iconClassName='ml-auto'
        />
      </RowDataCell>
      <td className='pb-2'>
        <div className='flex justify-end text-accent-1 ml-2'>
          <CopyIcon text={address} />
        </div>
      </td>
    </tr>
  )
}
