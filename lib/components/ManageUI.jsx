import React, { useState } from 'react'

import { AdminUI } from 'lib/components/AdminUI'
import { StatsUI } from 'lib/components/StatsUI'
import { Content, ContentPane, Tab, Tabs } from 'lib/components/Tabs'
import ManageImage from 'assets/images/manage-image.svg'
import { Button } from 'lib/components/Button'
import { Card, CardTitle } from 'lib/components/Card'
import { useAtom } from 'jotai'
import { poolAddressesAtom } from 'lib/hooks/usePoolAddresses'
import { EtherscanAddressLink } from 'lib/components/EtherscanAddressLink'

const MANAGE_VIEW = Object.freeze({
  stats: '#stats',
  admin: '#admin'
})

export const ManageUI = (props) => {
  const [selectedTab, setSelectedTab] = useState(window.location.hash || MANAGE_VIEW.stats)

  return (
    <>
      <ManageHeader />
      <PoolAddress />
      <Tabs>
        <Tab setSelectedTab={setSelectedTab} selectedTab={selectedTab} hash={MANAGE_VIEW.stats}>
          Stats
        </Tab>
        <Tab
          setSelectedTab={setSelectedTab}
          selectedTab={selectedTab}
          hash={MANAGE_VIEW.admin}
          className='ml-16'
        >
          Admin
        </Tab>
      </Tabs>

      <Content>
        <ContentPane selectedTab={selectedTab} hash={MANAGE_VIEW.stats}>
          <StatsUI />
        </ContentPane>

        <ContentPane selectedTab={selectedTab} hash={MANAGE_VIEW.admin}>
          <AdminUI />
        </ContentPane>
      </Content>
    </>
  )
}

const ManageHeader = () => {
  return (
    <div className='flex mt-10 mb-10 sm:mb-20 lg:justify-between'>
      <div className='flex-grow'>
        <h1 className='text-accent-1 title text-xl sm:text-6xl'>Prize Pool Dashboard</h1>

        <p className='text-accent-1 text-base sm:text-2xl max-w-3xl'>Version 3.1.0</p>

        <a
          href='https://docs.pooltogether.com/'
          target='_blank'
          className='trans text-xs sm:text-base no-underline border-0 active:outline-none hover:outline-none focus:outline-none'
        >
          <Button>View documentation</Button>
        </a>
      </div>
      <img
        src={ManageImage}
        className='hidden sm:block sm:w-32 lg:w-48 sm:ml-10'
        style={{ height: 'min-content' }}
      />
    </div>
  )
}

const PoolAddress = () => {
  const [poolAddresses] = useAtom(poolAddressesAtom)

  return (
    <>
      <div className='text-accent-1 font-bold title text-lg sm:text-4xl'>Pool's Info</div>
      <Card className='flex flex-col'>
        <CardTitle className='text-center mb-2'>Pool's contract address</CardTitle>
        <EtherscanAddressLink address={poolAddresses.prizePool} className='mx-auto text-white'>
          {poolAddresses.prizePool}
        </EtherscanAddressLink>
      </Card>
    </>
  )
}
