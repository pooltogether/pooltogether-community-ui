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
    ticketSymbol,
    tokenSymbol,
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
        'flex flex-col sm:flex-row sm:flex-wrap justify-center items-center',
        'mt-2 mb-4 rounded-xl text-base sm:text-lg',
      )}
    >
      <StatContainer>
        <BlueLineStat
          title={`Your balance`}
          value={<>
            {displayAmountInEther(usersTokenBalance, { precision: 2, decimals })}&nbsp;<span className='text-default-soft opacity-60'> {tokenSymbol || 'TOKEN'}</span>
          </>}
        />
      </StatContainer>

      <StatContainer>
        <BlueLineStat
          title={`Allowance`}
          value={<>
            {displayAmountInEther(usersTokenAllowance, { precision: 0, decimals })}&nbsp;<span className='text-default-soft opacity-60'>{tokenSymbol || 'TOKEN'}</span>
          </>}
        />
      </StatContainer>

      <StatContainer>
        <BlueLineStat
          title={`Your ticket balance`}
          value={<>
            {displayAmountInEther(usersTicketBalance, { precision: 2, decimals })}&nbsp;<span className='text-default-soft opacity-60'>{ticketSymbol || 'TICKET'}</span>
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

