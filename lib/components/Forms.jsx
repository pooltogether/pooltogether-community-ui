import React from 'react'
import classnames from 'classnames'

import { DepositUI } from 'lib/components/DepositUI'
// import { WithdrawUI } from 'lib/components/WithdrawUI'

export const Forms = (props) => {
  return <>
    <div
      className='flex flex-col sm:flex-row'
    >
      <div
        className={classnames(
          'bg-purple-1000 py-4 px-8 sm:p-8 lg:p-12 pb-16 rounded-xl lg:w-3/4 text-base sm:text-lg mb-20',
          '-mx-8 sm:-ml-8 sm:mr-4 lg:-ml-12 lg:mr-8',
        )}
      >
        <DepositUI
        />
      </div>
      <div
        className={classnames(
          'bg-purple-1000 py-4 px-8 sm:p-8 lg:p-12 pb-16 rounded-xl lg:w-3/4 text-base sm:text-lg mb-20',
          '-mx-8 sm:ml-4 sm:-mr-8 lg:ml-8 lg:-mr-12',
        )}
      >
        <DepositUI
        />
        {/* <WithdrawUI
        /> */}
      </div>
    </div>    
  </>
}

