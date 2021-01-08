import React, { useState } from 'react'
import { useAtom } from 'jotai'

import { AdminUI } from 'lib/components/AdminUI'
import { StatsUI } from 'lib/components/StatsUI'
import { Content, ContentPane, Tab, Tabs } from 'lib/components/Tabs'
import ManageImage from 'assets/images/manage-image.svg'
import { Card, CardTitle } from 'lib/components/Card'
import { poolAddressesAtom } from 'lib/hooks/usePoolAddresses'
import { EtherscanAddressLink } from 'lib/components/EtherscanAddressLink'
import { poolChainValuesAtom } from 'lib/hooks/usePoolChainValues'
import { usersAddressAtom } from 'lib/hooks/useUsersAddress'

const MANAGE_VIEW = Object.freeze({
  stats: '#stats',
  admin: '#admin'
})

export const ManageUI = (props) => {
  const [selectedTab, setSelectedTab] = useState(window.location.hash || MANAGE_VIEW.stats)
  const [poolChainValues] = useAtom(poolChainValuesAtom)
  const [usersAddress] = useAtom(usersAddressAtom)

  const owner = poolChainValues.owner
  const userIsOwner = owner?.toLowerCase() === usersAddress?.toLowerCase()

  return (
    <>
      <ManageHeader />
      <PoolAddress />
      <Tabs>
        <Tab setSelectedTab={setSelectedTab} selectedTab={selectedTab} hash={MANAGE_VIEW.stats}>
          Stats
        </Tab>
        {userIsOwner && (
          <Tab
            setSelectedTab={setSelectedTab}
            selectedTab={selectedTab}
            hash={MANAGE_VIEW.admin}
            className='ml-16'
          >
            Admin
          </Tab>
        )}
      </Tabs>

      <Content>
        <ContentPane selectedTab={selectedTab} hash={MANAGE_VIEW.stats}>
          <StatsUI />
        </ContentPane>

        {userIsOwner && (
          <ContentPane selectedTab={selectedTab} hash={MANAGE_VIEW.admin}>
            <AdminUI />
          </ContentPane>
        )}
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
          className='bg-green-400 bg-opacity-0 hover:bg-opacity-15 active:bg-opacity-15 border border-green-1 active:shadow-green focus:shadow-green text-highlight-2 inline-block text-center leading-snug tracking-wide outline-none focus:outline-none active:outline-none font-bold width-max-content py-1 px-6 sm:py-2 sm:px-10 rounded-full base text-sm sm:text-base lg:text-lg trans trans-fast cursor-pointer mt-6'
          href='https://docs.pooltogether.com/'
        >
          View documentation
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
        <CardTitle className='mb-2'>Pool's contract address</CardTitle>
        <EtherscanAddressLink address={poolAddresses.prizePool} className='mx-auto text-white'>
          {poolAddresses.prizePool}
        </EtherscanAddressLink>
      </Card>
    </>
  )
}
