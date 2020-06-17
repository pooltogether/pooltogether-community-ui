import React, { useState } from 'react'
import classnames from 'classnames'

import { BlueLineStat } from 'lib/components/BlueLineStat'
import { EtherscanAddressLink } from 'lib/components/EtherscanAddressLink'
import { StatContainer } from 'lib/components/StatContainer'

export const PoolRelatedAddressesUI = (props) => {
  const {
    networkName,
    poolAddresses,
  } = props

  const [showPoolAddresses, setShowPoolAddresses] = useState(false)

  return <>
    <div>
      <button
        onClick={(e) => {
          e.preventDefault()
          setShowPoolAddresses(true)
        }}
        className={classnames(
          `mt-2 animated text-purple-400 hover:text-green-300 trans text-xxs sm:text-base lg:text-base no-underline hover:underline`,
          {
            'fadeOut': showPoolAddresses,
          }
        )}
      >
        Show related pool addresses
      </button>
    </div>
    <div
      className={classnames(
        'flex flex-col sm:flex-row sm:flex-wrap justify-center items-center',
        'mt-2 mb-4 rounded-xl text-base sm:text-lg animated faster',
        {
          'h-0 opacity-0 pointer-events-none': !showPoolAddresses, 
          'fadeIn': showPoolAddresses,
        }
      )}
    >
      <StatContainer>
        <BlueLineStat
          title='ticket()'
          value={<>
            <EtherscanAddressLink
              address={poolAddresses.ticket}
              networkName={networkName}
              size='xxs'
            >
              {poolAddresses.ticket}
            </EtherscanAddressLink>
          </>}
        />
      </StatContainer>

      <StatContainer>
        <BlueLineStat
          title='sponsorship()'
          value={<>
            <EtherscanAddressLink
              address={poolAddresses.sponsorship}
              networkName={networkName}
              size='xxs'
            >
              {poolAddresses.sponsorship}
            </EtherscanAddressLink>
          </>}
        />
      </StatContainer>

      <StatContainer>
        <BlueLineStat
          title='prizeStrategy()'
          value={<>
            <EtherscanAddressLink
              address={poolAddresses.prizeStrategy}
              networkName={networkName}
              size='xxs'
            >
              {poolAddresses.prizeStrategy}
            </EtherscanAddressLink>
          </>}
        />
      </StatContainer>

      <StatContainer>
        <BlueLineStat
          title='erc20 token()'
          value={<>
            <EtherscanAddressLink
              address={poolAddresses.token}
              networkName={networkName}
              size='xxs'
            >
              {poolAddresses.token}
            </EtherscanAddressLink>
          </>}
        />
      </StatContainer>

    </div>
    
  </>
}

