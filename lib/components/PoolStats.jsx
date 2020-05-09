import React from 'react'
import classnames from 'classnames'

import { BlueLineStat } from 'lib/components/BlueLineStat'
import { StatContainer } from 'lib/components/StatContainer'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

export const PoolStats = (props) => {
  const {
    genericChainValues
  } = props

  return <>
    <div
      className={classnames(
        'flex flex-col sm:flex-row sm:flex-wrap justify-center items-center',
        'my-4 rounded-xl text-base sm:text-lg',
      )}
    >
      <StatContainer>
        <BlueLineStat
          title='Total ticket supply'
          value={`${displayAmountInEther(genericChainValues.ticketTotalSupply, { precision: 2 })} ${genericChainValues.erc20Symbol || 'TOKEN'}`}
        />
      </StatContainer>

      <StatContainer>
        <BlueLineStat
          title='EST. prize remaining'
          value={displayAmountInEther(genericChainValues.estimateRemainingPrize, { precision: 0 })}
        />
      </StatContainer>

      <StatContainer>
        <BlueLineStat
          title='Seconds until reward'
          value={genericChainValues.remainingSecondsToPrize.toString()}
        />
      </StatContainer>

      <StatContainer>
        <BlueLineStat
          title='Ticket Name &amp; Symbol'
          value={`${genericChainValues.ticketSymbol}: ${genericChainValues.ticketName}`}
        />
      </StatContainer>

      <StatContainer>
        <BlueLineStat
          title='Sponsorship Name &amp; Symbol'
          value={`${genericChainValues.sponsorshipSymbol}: ${genericChainValues.sponsorshipName}`}
        />
      </StatContainer>

    </div>
    
  </>
}

