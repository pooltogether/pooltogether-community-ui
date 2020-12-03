import classnames from 'classnames'
import { BlueLineStat } from 'lib/components/BlueLineStat'
import { EtherscanAddressLink } from 'lib/components/EtherscanAddressLink'
import { StatContainer } from 'lib/components/StatContainer'
import React, { useState } from 'react'

export const PoolRelatedAddressesUI = (props) => {
  const { networkName, poolAddresses } = props

  const [showPoolAddresses, setShowPoolAddresses] = useState(true)

  return (
    <>
      {/* <div>
      <button
        onClick={(e) => {
          e.preventDefault()
          setShowPoolAddresses(true)
        }}
        className={classnames(
          `mt-2 animated text-highlight-3 hover:text-green-1 trans text-xxs sm:text-base lg:text-base border-b-2 border-purple-800 hover:border-purple-700`,
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
          'flex flex-col justify-center items-center text-center',
          'mt-8 mb-4 rounded-xl text-base sm:text-lg animated faster',
          {
            'h-0 opacity-0 pointer-events-none': !showPoolAddresses,
            'fadeIn': showPoolAddresses
          }
        )}
      >
        <h4 className='my-4'>Related contract addresses:</h4>
        <div>
          <StatContainer>
            <BlueLineStat
              title='Ticket'
              value={
                <>
                  <EtherscanAddressLink
                    address={poolAddresses.ticket}
                    networkName={networkName}
                    size='xxs'
                  >
                    {poolAddresses.ticket}
                  </EtherscanAddressLink>
                </>
              }
            />
          </StatContainer>

          <StatContainer>
            <BlueLineStat
              title='Sponsorship'
              value={
                <>
                  <EtherscanAddressLink
                    address={poolAddresses.sponsorship}
                    networkName={networkName}
                    size='xxs'
                  >
                    {poolAddresses.sponsorship}
                  </EtherscanAddressLink>
                </>
              }
            />
          </StatContainer>

          <StatContainer>
            <BlueLineStat
              title='Prize Strategy'
              value={
                <>
                  <EtherscanAddressLink
                    address={poolAddresses.prizeStrategy}
                    networkName={networkName}
                    size='xxs'
                  >
                    {poolAddresses.prizeStrategy}
                  </EtherscanAddressLink>
                </>
              }
            />
          </StatContainer>

          <StatContainer>
            <BlueLineStat
              title='ERC20 Token (Underlying)'
              value={
                <>
                  <EtherscanAddressLink
                    address={poolAddresses.token}
                    networkName={networkName}
                    size='xxs'
                  >
                    {poolAddresses.token}
                  </EtherscanAddressLink>
                </>
              }
            />
          </StatContainer>

          <StatContainer>
            <BlueLineStat
              title='RNG (Random Number Generator)'
              value={
                <>
                  <EtherscanAddressLink
                    address={poolAddresses.rng}
                    networkName={networkName}
                    size='xxs'
                  >
                    {poolAddresses.rng}
                  </EtherscanAddressLink>
                </>
              }
            />
          </StatContainer>
        </div>
      </div>
    </>
  )
}
