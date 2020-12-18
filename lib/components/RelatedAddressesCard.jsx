import React, { useMemo } from 'react'
import { useAtom } from 'jotai'
import { Card } from 'lib/components/Card'
import { Collapse } from 'lib/components/Collapse'
import { poolAddressesAtom } from 'lib/hooks/usePoolAddresses'
import { RowDataCell, Table } from 'lib/components/Table'
import { EtherscanAddressLink } from 'lib/components/EtherscanAddressLink'

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
        <Table headers={['Contract', 'Address']} rows={rows} className='w-full' />
      </Collapse>
    </Card>
  )
}

const Row = (props) => {
  const { contract, address } = props

  return (
    <tr>
      <RowDataCell first>{contract}</RowDataCell>
      <RowDataCell>
        <EtherscanAddressLink size='xxs' address={address} className='text-accent-1'>
          {address}
        </EtherscanAddressLink>
      </RowDataCell>
    </tr>
  )
}
