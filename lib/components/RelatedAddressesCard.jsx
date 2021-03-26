import React, { useMemo } from 'react'
import { useAtom } from 'jotai'
import { Card } from 'lib/components/Card'
import { Collapse } from 'lib/components/Collapse'
import { poolAddressesAtom } from 'lib/hooks/usePoolAddresses'
import { RowDataCell, Table } from 'lib/components/Table'
import { BlockExplorerLink } from 'lib/components/BlockExplorerLink'
import { CopyIcon } from 'lib/components/CopyIcon'

export const RelatedAddressesCard = (props) => {
  const [poolAddresses] = useAtom(poolAddressesAtom)
  const rows = useMemo(() => {
    const rowData = [
      {
        contract: 'Ticket',
        address: poolAddresses.ticket
      },
      {
        contract: 'Sponsorship',
        address: poolAddresses.sponsorship
      },
      {
        contract: 'Prize pool',
        address: poolAddresses.prizePool
      },
      {
        contract: 'Prize strategy',
        address: poolAddresses.prizeStrategy
      },
      {
        contract: 'ERC20 Token (Underlying)',
        address: poolAddresses.token
      },
      {
        contract: 'Random Number Generator (RNG)',
        address: poolAddresses.rng
      }
    ]

    return rowData.map((data, index) => (
      <Row key={index} index={index} contract={data.contract} address={data.address} />
    ))
  }, [poolAddresses])

  return (
    <Card>
      <Collapse title='Related contract addresses'>
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
        <BlockExplorerLink address={address} className='text-xs sm:text-base' />
      </RowDataCell>
      <td className=''>
        <div className='flex justify-end'>
          <CopyIcon text={address} />
        </div>
      </td>
    </tr>
  )
}
