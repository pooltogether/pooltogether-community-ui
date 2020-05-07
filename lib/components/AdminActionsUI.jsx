import React from 'react'

import { CompleteAwardUI } from 'lib/components/CompleteAwardUI'
import { StartAwardUI } from 'lib/components/StartAwardUI'

export const AdminActionsUI = (props) => {
  return <>
    <StartAwardUI
      {...props}
    />
    <CompleteAwardUI
      {...props}
    />
  </>
}

