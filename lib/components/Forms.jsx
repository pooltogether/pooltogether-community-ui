import React from 'react'

import { DepositUI } from 'lib/components/DepositUI'
// import { WithdrawUI } from 'lib/components/WithdrawUI'

export const Forms = (props) => {
  return <>
    <div
      className='bg-purple-1000 -mx-8 sm:-mx-0 py-4 px-8 sm:p-10 pb-16 rounded-xl lg:w-3/4 text-base sm:text-lg mb-20'
    >
      <DepositUI
      />

      {/* <WithdrawUI
      /> */}
    </div>
    
  </>
}

