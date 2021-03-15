import React from 'react'

import PoolTogetherMark from 'assets/images/pooltogether-white-mark.svg'
import { LoadingDots } from 'lib/components/LoadingDots'

export const PoolTogetherLoading = () => {
  return (
    <div className='m-auto flex flex-col'>
      <img
        src={PoolTogetherMark}
        className='w-8 outline-none mx-auto mb-8'
        style={{ borderWidth: 0 }}
      />
      <LoadingDots />
    </div>
  )
}
