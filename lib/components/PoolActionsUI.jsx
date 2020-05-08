import React from 'react'

import { CompleteAwardUI } from 'lib/components/CompleteAwardUI'
import { PoolStats } from 'lib/components/PoolStats'
import { StartAwardUI } from 'lib/components/StartAwardUI'

export const PoolActionsUI = (props) => {
  if (!props.usersAddress) {
    return null
  }

  return <>
    <PoolStats
      {...props}
    />
    <StartAwardUI
      {...props}
    />
    <CompleteAwardUI
      {...props}
    />
  </>
}

