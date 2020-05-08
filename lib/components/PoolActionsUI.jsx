import React from 'react'

import { CompleteAwardUI } from 'lib/components/CompleteAwardUI'
import { StartAwardUI } from 'lib/components/StartAwardUI'

export const PoolActionsUI = (props) => {
  if (!props.usersAddress) {
    return null
  }

  return <>
    <StartAwardUI
      {...props}
    />
    <CompleteAwardUI
      {...props}
    />
  </>
}

