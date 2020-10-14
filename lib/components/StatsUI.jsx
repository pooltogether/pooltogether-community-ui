import React from 'react'

import { PoolRelatedAddressesUI } from 'lib/components/PoolRelatedAddressesUI'
import { PoolStats } from 'lib/components/PoolStats'

export const StatsUI = (props) => {
  return <>
    <PoolStats
      {...props}
    />
    <PoolRelatedAddressesUI
      {...props}
    />
  </>
}

