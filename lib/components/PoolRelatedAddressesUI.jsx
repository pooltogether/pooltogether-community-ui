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

  const [showPoolAddresses, setShowPoolAddresses] = useState(true)

  return <>
    {/* <div>
      <button
        onClick={(e) => {
          e.preventDefault()
          setShowPoolAddresses(true)
        }}
        className={classnames(
          `mt-2 animated text-highlight-3 hover:text-green trans text-xxs sm:text-base lg:text-base border-b-2 border-purple-800 hover:border-purple-700`,
          {
            'fadeOut': showPoolAddresses,
          }
        )}
      >
        Show related pool addresses
      </button>
    </div> */}
    <div
      className={classnames(
        'flex flex-col sm:flex-row sm:flex-wrap justify-center items-center text-center',
        'mt-8 mb-4 rounded-xl text-base sm:text-lg animated faster',
        {
          'h-0 opacity-0 pointer-events-none': !showPoolAddresses, 
          'fadeIn': showPoolAddresses,
        }
      )}
    >
      <h4>
        Related contract addresses:
      </h4>
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
          title='underlying erc20 token()'
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
      
      <StatContainer>
        <BlueLineStat
          title='rng()'
          value={<>
            <EtherscanAddressLink
              address={poolAddresses.rng}
              networkName={networkName}
              size='xxs'
            >
              {poolAddresses.rng}
            </EtherscanAddressLink>
          </>}
        />
      </StatContainer>

    </div>
    
  </>
}

