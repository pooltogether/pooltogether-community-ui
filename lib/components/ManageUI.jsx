import React, { useEffect, useState } from 'react'

import { AdminUI } from 'lib/components/AdminUI'
import { StatsUI } from 'lib/components/StatsUI'
import { Content, ContentPane, Tab, Tabs } from 'lib/components/Tabs'
import { Card, CardSecondaryTitle } from 'lib/components/Card'
import { ButtonLink } from 'lib/components/ButtonLink'
import { RelativeInternalLink } from 'lib/components/RelativeInternalLink'
import { BlockExplorerLink } from 'lib/components/BlockExplorerLink'
import { RelativeNavLinks } from 'lib/components/RelativeNavLinks'
import { CopyIcon } from 'lib/components/CopyIcon'
import { usePrizePoolContracts } from 'lib/hooks/usePrizePoolContracts'

import ManageImage from 'assets/images/manage-image.svg'

const MANAGE_VIEW = Object.freeze({
  stats: '#stats',
  admin: '#admin'
})

export const ManageUI = (props) => {
  const hash = window.location.hash
  const [selectedTab, setSelectedTab] = useState(hash || MANAGE_VIEW.stats)

  useEffect(() => {
    setSelectedTab(hash || MANAGE_VIEW.stats)
  }, [hash])

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

      <RelativeNavLinks />
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
      <Card className='flex flex-col mb-10'>
        <CardSecondaryTitle className='mb-2'>Pool's contract address</CardSecondaryTitle>
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
