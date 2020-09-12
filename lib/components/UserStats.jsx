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
    tokenDecimals,
  } = genericChainValues

  const {
    usersTokenBalance,
    usersTokenAllowance,
    usersTicketBalance,
  } = usersChainValues

  const decimals = tokenDecimals

  return <>
    <div
      className={classnames(
        // 'flex flex-col sm:flex-row justify-between',
        'flex flex-col sm:flex-row sm:flex-wrap justify-center items-center',
        'mt-2 mb-4 rounded-xl text-base sm:text-lg',
      )}
    >
      {/* <div
        className='w-full sm:w-1/3 flex-grow rounded-lg px-4 py-1 my-1 bg-darkened opacity-80 hover:opacity-100 trans'
      >
        <strong
          className='text-highlight-2'
        >ETH Balance:</strong>
        <br />
        {displayAmountInEther(ethBalance, { precision: 2 })}
      </div> */}

      <StatContainer>
        <BlueLineStat
          title={`Your balance`}
          value={<>
            {displayAmountInEther(usersTokenBalance, { precision: 2, decimals })}&nbsp;<span className='text-blue'> {genericChainValues.tokenSymbol || 'TOKEN'}</span>
          </>}
        />
      </StatContainer>

      <StatContainer>
        <BlueLineStat
          title={`Allowance`}
          value={<>
            {displayAmountInEther(usersTokenAllowance, { precision: 0, decimals })}&nbsp;<span className='text-blue'>{genericChainValues.tokenSymbol || 'TOKEN'}</span>
          </>}
        />
      </StatContainer>

      <StatContainer>
        <BlueLineStat
          title={`Your ticket balance`}
          value={<>
            {displayAmountInEther(usersTicketBalance, { precision: 2, decimals })}&nbsp;<span className='text-blue'>{genericChainValues.ticketSymbol || 'TICKET'}</span>
          </>}
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

