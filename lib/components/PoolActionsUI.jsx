import React from 'react'

import { CompleteAwardUI } from 'lib/components/CompleteAwardUI'
import { PoolControls } from 'lib/components/PoolControls'
import { StartAwardUI } from 'lib/components/StartAwardUI'

export const PoolActionsUI = (props) => {
  if (!props.usersAddress) {
    return null
  }

  return <>
    <PoolControls
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

