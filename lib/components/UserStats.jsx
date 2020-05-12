import React from 'react'
import classnames from 'classnames'

import { BlueLineStat } from 'lib/components/BlueLineStat'
import { StatContainer } from 'lib/components/StatContainer'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

export const UserStats = (props) => {
  const {
    ethBalance,
    genericChainValues,
    usersChainValues,
  } = props
  
  const {
    erc20Decimals,
  } = genericChainValues

  const {
    usersERC20Balance,
    usersERC20Allowance,
    usersTicketBalance,
  } = usersChainValues

  const decimals = erc20Decimals

  return <>
    <div
      className={classnames(
        // 'flex flex-col sm:flex-row justify-between',
        'flex flex-col sm:flex-row sm:flex-wrap justify-center items-center',
        'mt-2 mb-4 rounded-xl text-base sm:text-lg',
      )}
    >
      {/* <div
        className='w-full sm:w-1/3 flex-grow rounded-lg px-4 py-1 my-1 bg-purple-1100 opacity-80 hover:opacity-100 trans'
      >
        <strong
          className='text-purple-400'
        >ETH Balance:</strong>
        <br />
        {displayAmountInEther(ethBalance, { precision: 2 })}
      </div> */}

      <StatContainer>
        <BlueLineStat
          title={`Your ${genericChainValues.erc20Symbol || 'TOKEN'} balance`}
          value={displayAmountInEther(usersERC20Balance, { precision: 2, decimals })}
        />
      </StatContainer>

      <StatContainer>
        <BlueLineStat
          title={`${genericChainValues.erc20Symbol || 'TOKEN'} Allowance`}
          value={displayAmountInEther(usersERC20Allowance, { precision: 0, decimals })}
        />
      </StatContainer>

      <StatContainer>
        <BlueLineStat
          title={`Your ticket balance`}
          value={displayAmountInEther(usersTicketBalance, { precision: 2, decimals })}
        />
      </StatContainer>

      {/* <StatContainer>
        <BlueLineStat
          title={`Your scheduled balance`}
          value={displayAmountInEther(usersTimelockBalanceAvailableAt, { precision: 2, decimals })}
        />
      </StatContainer> */}
      
    </div>
  </>
}

