import React from 'react'
import { useAtom } from 'jotai'

import { NotificationBanner } from 'lib/components/NotificationBanners'
import { PRIZE_POOL_TYPE } from 'lib/constants'
import { prizePoolTypeAtom } from 'lib/hooks/useDetermineContractVersions'
import { poolChainValuesAtom } from 'lib/hooks/usePoolChainValues'

export const CustomYieldNotificationBanner = () => {
  const [prizePoolType] = useAtom(prizePoolTypeAtom)
  const [poolChainValues] = useAtom(poolChainValuesAtom)

  if (prizePoolType !== PRIZE_POOL_TYPE.yield) return null

  return (
    <NotificationBanner className='bg-purple-2'>
      <CustomYieldNotification />
    </NotificationBanner>
  )
}

const CustomYieldNotification = (props) => {
  return (
    <span>⚠️ This Prize Pool is running a custom Yield source that may not have been audited.</span>
  )
}
