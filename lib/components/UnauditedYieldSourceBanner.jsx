import React from 'react'

import { NotificationBanner } from 'lib/components/NotificationBanners'
import { PRIZE_POOL_TYPE } from 'lib/constants'
import { useNetwork } from 'lib/hooks/useNetwork'
import { usePrizePoolContracts } from 'lib/hooks/usePrizePoolContracts'
import { usePrizePoolType } from 'lib/hooks/usePrizePoolType'
import { prizePoolUsesKnownYieldSource } from 'lib/utils/yieldSourceFormatters'

export const UnauditedYieldSourceBanner = () => {
  const prizePoolType = usePrizePoolType()

  const { chainId } = useNetwork()
  const { data: prizePoolContracts } = usePrizePoolContracts()
  const yieldSourceAddress = prizePoolContracts?.yieldSource.address

  if (prizePoolType !== PRIZE_POOL_TYPE.yield) return null

  if (prizePoolUsesKnownYieldSource(chainId, yieldSourceAddress, prizePoolType)) return null

  return (
    <NotificationBanner className='bg-purple-2' canClose>
      <UnauditedYieldSource />
    </NotificationBanner>
  )
}

const UnauditedYieldSource = (props) => {
  return (
    <span>
      ⚠️ This prize pool may be using an unaudited yield source. Deposit at your own risk.
    </span>
  )
}
