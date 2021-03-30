import React, { useState } from 'react'

import { AdminUI } from 'lib/components/AdminUI'
import { StatsUI } from 'lib/components/StatsUI'
import { Content, ContentPane, Tab, Tabs } from 'lib/components/Tabs'
import { Card, CardTitle } from 'lib/components/Card'
import { ButtonLink } from 'lib/components/ButtonLink'

import ManageImage from 'assets/images/manage-image.svg'
import { RelativeInternalLink } from 'lib/components/RelativeInternalLink'
import { BlockExplorerLink } from 'lib/components/BlockExplorerLink'
import { CopyIcon } from 'lib/components/CopyIcon'
import { useUsersAddress } from 'lib/hooks/useUsersAddress'
import { usePoolChainValues } from 'lib/hooks/usePoolChainValues'
import { usePrizePoolContracts } from 'lib/hooks/usePrizePoolContracts'

const MANAGE_VIEW = Object.freeze({
  stats: '#stats',
  admin: '#admin'
})

export const ManageUI = (props) => {
  const [selectedTab, setSelectedTab] = useState(window.location.hash || MANAGE_VIEW.stats)
  const { data: poolChainValues } = usePoolChainValues()
  const usersAddress = useUsersAddress()
  const owner = poolChainValues.config.owner
  const userIsOwner = owner?.toLowerCase() === usersAddress?.toLowerCase()

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
          className='ml-4 sm:ml-16'
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
      <div className='flex justify-between w-3/4 sm:w-1/2 mx-auto'>
        <RelativeInternalLink link='/home'>View Prize Pool</RelativeInternalLink>
        <RelativeInternalLink link='/admin'>Manage Pool</RelativeInternalLink>
      </div>
    </>
  )
}

const ManageHeader = () => {
  return (
    <div className='flex mt-10 mb-10 sm:mb-20 lg:justify-between'>
      <div className='flex-grow'>
        <h1 className='text-accent-1 title text-xl sm:text-6xl'>Prize Pool Dashboard</h1>
        <ButtonLink
          size='base'
          color='secondary'
          className='mt-6'
          href='https://docs.pooltogether.com/'
        >
          View documentation
        </ButtonLink>
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
  const { data: prizePoolContracts } = usePrizePoolContracts()

  return (
    <>
      <div className='text-accent-1 font-bold title text-lg sm:text-4xl'>Pool's Info</div>
      <Card className='flex flex-col'>
        <CardTitle className='mb-2'>Pool's contract address</CardTitle>
        <h5 className='font-normal mx-auto flex'>
          <BlockExplorerLink
            address={prizePoolContracts.prizePool.address}
            className='text-white'
          />
          <CopyIcon text={prizePoolContracts.prizePool.address} className='ml-4' />
        </h5>
      </Card>
    </>
  )
}
