import React, { useState } from 'react'
import FeatherIcon from 'feather-icons-react'

import { useNetwork } from 'lib/hooks/useNetwork'
import { usePrizePoolContracts } from 'lib/hooks/usePrizePoolContracts'
import { NETWORKS_TO_IGNORE_VERSION_CHECKS, SUPPORTED_NETWORKS } from 'lib/constants'
import { chainIdToName } from 'lib/utils/networks'

// TODO: Put this back in the app
export const IncompatibleContractWarning = (props) => {
  const { address } = props

  const { data: prizePoolContracts } = usePrizePoolContracts()
  const { chainId, name: networkName } = useNetwork()

  const [hideWarning, setHideWarning] = useState(false)
  const [showMoreInfo, setShowMoreInfo] = useState(false)

  const prizePoolAddress = prizePoolContracts.prizePool.address

  if (hideWarning) return null

  if (NETWORKS_TO_IGNORE_VERSION_CHECKS.includes(chainId)) return null

  return (
    <div className='text-left mb-10 border-2 border-primary rounded-lg px-7 py-4'>
      <div className='flex flex-row w-full relative'>
        <button
          className='absolute r-0'
          onClick={(e) => {
            e.preventDefault()
            setHideWarning(true)
          }}
        >
          <FeatherIcon
            icon='x'
            className='ml-auto w-6 h-6 my-auto text-accent-1 trans hover:text-inverse stroke-current'
          />
        </button>
        <div className='flex flex-col sm:flex-row text-orange-600'>
          <FeatherIcon icon='alert-triangle' className='w-10 h-10 my-auto stroke-current' />
          <div className='sm:ml-4'>
            <h4 className='mb-0'>Warning</h4>
            <p className='text-inverse text-sm my-0'>
              This version of the app may be incompatible with these contracts.
            </p>
          </div>
        </div>
      </div>
      <button
        onClick={() => setShowMoreInfo(!showMoreInfo)}
        className='flex text-sm mt-2 text-accent-1'
      >
        {showMoreInfo ? 'Hide info' : 'More info'}
        <FeatherIcon
          icon={showMoreInfo ? 'chevron-up' : 'chevron-down'}
          className='ml-1 w-4 h-4 my-auto'
        />
      </button>

      {showMoreInfo && (
        <div className='mt-2'>
          <h6 className='break-all'>
            This version of the app may be incompatible with this contract '{address}' on{' '}
            {networkName}.
          </h6>
          <h6 className='mt-4'>
            Contract version identifiers may need to be added for new pooltogether-contracts
            versions in current-pool-data.
          </h6>
          <hr />
          <h5 className='text-accent-1'>Is {networkName} the correct network for this contract?</h5>
          Possibly try one of the following networks:
          <ul className='flex flex-col mt-2'>
            {SUPPORTED_NETWORKS.map((network) => {
              if (network === chainId || network === 31337 || network === 1234) return null
              const networkName = chainIdToName(network)
              return (
                <li className='ml-2' key={network}>
                  <a
                    className='text-green-1 trans hover:text-inverse'
                    href={`/pools/${networkName}/${prizePoolAddress}`}
                  >
                    {networkName}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
