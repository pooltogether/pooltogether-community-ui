import React from 'react'

import { CompleteAwardUI } from 'lib/components/CompleteAwardUI'
import { PoolRelatedAddressesUI } from 'lib/components/PoolRelatedAddressesUI'
import { PoolStats } from 'lib/components/PoolStats'
import { StartAwardUI } from 'lib/components/StartAwardUI'

export const StatsUI = (props) => {
  return <>
    {props.usersAddress && <>
      <div className='my-4'>
        <StartAwardUI
          {...props}
        />
        <CompleteAwardUI
          {...props}
        />
      </div>
    </>}

    <PoolStats
      {...props}
    />
    <PoolRelatedAddressesUI
      {...props}
    />
  </>
}

