import React from 'react'
import FeatherIcon from 'feather-icons-react'

import { ChangeWalletNetworkNotificationBanner } from 'lib/components/ChangeWalletNetworkNotificationBanner'
import { StaticNetworkNotificationBanner } from 'lib/components/StaticNetworkNotificationBanner'

export const NotificationBanners = (props) => {
  return (
    <div className='flex flex-col sticky t-0 z-50'>
      <StaticNetworkNotificationBanner />
      <ChangeWalletNetworkNotificationBanner />
    </div>
  )
}

export const CloseBannerButton = (props) => (
  <button
    className='absolute r-1 t-1 opacity-70 hover:opacity-100 cursor-pointer trans'
    onClick={() => props.closeBanner()}
  >
    <FeatherIcon icon='x' className='h-4 w-4 sm:h-6 sm:w-6' />
  </button>
)
