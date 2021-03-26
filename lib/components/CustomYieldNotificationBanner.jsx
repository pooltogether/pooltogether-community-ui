import React from 'react'

import { NotificationBanner } from 'lib/components/NotificationBanners'
import { PRIZE_POOL_TYPE } from 'lib/constants'
import { usePrizePoolType } from 'lib/hooks/usePrizePoolType'

export const CustomYieldNotificationBanner = () => {
  const prizePoolType = usePrizePoolType()

  if (prizePoolType !== PRIZE_POOL_TYPE.yield) return null

  return (
    <NotificationBanner className='bg-purple-2'>
      <CustomYieldNotification />
    </NotificationBanner>
  )
}

const CustomYieldNotification = (props) => {
  return (
    <span>
      ⚠️ This prize pool may be using an unaudited yield source. Deposit at your own risk.
    </span>
  )
}
