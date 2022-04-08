import React from 'react'
import FeatherIcon from 'feather-icons-react'

import { NotificationBanner } from 'lib/components/NotificationBanners'
import { usePoolChainValues } from 'lib/hooks/usePoolChainValues'
import { useIsOwnerPoolTogether } from 'lib/hooks/useIsOwnerPoolTogether'

export const CommunityPoolNotificationBanner = () => {
  const { data: poolChainValues, isFetched: poolChainValuesIsFetched } = usePoolChainValues()
  const isPtPool = useIsOwnerPoolTogether(poolChainValues?.config.owner)

  if (!poolChainValuesIsFetched || isPtPool) return null

  return (
    <NotificationBanner className='bg-red' canClose>
      <div className='flex justify-between space-x-2 xs:space-x-4 '>
        <div className='my-auto text-orange'>
          <FeatherIcon icon='alert-triangle' className='w-6 h-6 xs:w-8 xs:h-8' />
        </div>
        <div className='text-center'>
          This pool is independently created and managed.{' '}
          <b>It is not controlled by PoolTogether.</b> Be sure you trust the administrators before
          depositing.
        </div>
      </div>
    </NotificationBanner>
  )
}
