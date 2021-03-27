import React from 'react'
import FeatherIcon from 'feather-icons-react'

import { AdminUI } from 'lib/components/AdminUI'
import { ButtonLink } from 'lib/components/ButtonLink'
import { RelativeInternalLink } from 'lib/components/RelativeInternalLink'
import { BlockExplorerLink } from 'lib/components/BlockExplorerLink'
import { PoolData } from 'lib/components/PoolData'

import ManageImage from 'assets/images/manage-image.svg'
import { usePoolChainValues } from 'lib/hooks/usePoolChainValues'
import { useUsersAddress } from 'lib/hooks/useUsersAddress'

export default function IndexPage() {
  return (
    <PoolData>
      <AdminHeader />
      <OwnerWarning />
      <AdminUI />
      <div className='flex justify-between w-3/4 sm:w-1/2 mx-auto'>
        <RelativeInternalLink link='/manage'>View Pool Details</RelativeInternalLink>
        <RelativeInternalLink link='/home'>View Prize Pool</RelativeInternalLink>
      </div>
    </PoolData>
  )
}

const AdminHeader = () => {
  return (
    <div className='flex mt-10 mb-10 sm:mb-20 lg:justify-between'>
      <div className='flex-grow'>
        <h1 className='text-accent-1 title text-xl sm:text-6xl'>Admin Dashboard</h1>
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

const OwnerWarning = () => {
  const { data: poolChainValues } = usePoolChainValues()
  const usersAddress = useUsersAddress()

  const owner = poolChainValues.config.owner
  const userIsOwner = owner?.toLowerCase() === usersAddress?.toLowerCase()

  if (!poolChainValues || !usersAddress || userIsOwner) return null

  return (
    <div className='p-4 border b-purple mb-4 rounded-xl flex flex-col sm:flex-row'>
      <FeatherIcon icon='alert-triangle' className='mr-2 w-10 h-10 my-auto text-orange-500' />
      <p>
        Certain actions may only be performed by the owner of the pool. The wallet you have
        connected (<BlockExplorerLink shorten address={usersAddress} />) is not the owner.
      </p>
    </div>
  )
}
