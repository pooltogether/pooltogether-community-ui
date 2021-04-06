import React, { useEffect, useState } from 'react'
import FeatherIcon from 'feather-icons-react'
import { useAtom } from 'jotai'
import { getChain } from '@pooltogether/evm-chains-extended'

import { NETWORKS_TO_IGNORE_VERSION_CHECKS, SUPPORTED_NETWORKS } from 'lib/constants'
import { EMPTY_ERROR_STATE, errorStateAtom } from 'lib/atoms'
import { useNetwork } from 'lib/hooks/useNetwork'
import { usePrizePoolContracts } from 'lib/hooks/usePrizePoolContracts'

export const IncompatibleContractWarning = (props) => {
  const [errorState, setErrorState] = useAtom(errorStateAtom)
  const { data: prizePoolContracts } = usePrizePoolContracts()
  const { chainId: poolChainId, name: networkName } = useNetwork()

  const [hideWarning, setHideWarning] = useState(false)
  const [showMoreInfo, setShowMoreInfo] = useState(false)

  const unknownContracts = errorState.unknownContracts
  const prizePoolAddress = prizePoolContracts.prizePool.address

  useEffect(() => {
    return () => {
      setErrorState(EMPTY_ERROR_STATE)
    }
  }, [])

  if (
    hideWarning ||
    unknownContracts.length === 0 ||
    NETWORKS_TO_IGNORE_VERSION_CHECKS.includes(poolChainId)
  ) {
    return null
  }

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
          <FeatherIcon icon='alert-triangle' className='w-10 h-10 sm:mt-2 stroke-current' />
          <div className='sm:ml-4'>
            <h4 className='mb-0'>Warning</h4>
            <p className='text-inverse text-sm my-0'>
              This version of the app may be incompatible with these contracts.
            </p>
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
          </div>
        </div>
      </div>

      {showMoreInfo && (
        <div className='mt-2'>
          <hr />
          <p className='break-all'>
            The following contracts could not be verified on {networkName}:
            <ul>
              {unknownContracts.map((address) => (
                <li className='ml-4 font-bold' key={address}>
                  {address}
                </li>
              ))}
            </ul>
          </p>
          <p className='mt-4'>
            Contract version identifiers may need to be added for new{' '}
            <code>pooltogether-contracts</code> versions in <code>current-pool-data</code>.
          </p>
          <hr />
          <p>
            Is <b>{networkName}</b> the correct network for this contract?
          </p>
          <p>Possibly try one of the following networks:</p>
          <ul className='flex flex-col mt-2'>
            {SUPPORTED_NETWORKS.map((_chainId) => {
              if (_chainId === poolChainId || _chainId === 31337 || _chainId === 1234) return null
              const networkName = getChain(_chainId)?.network

              return (
                <li className='ml-2' key={_chainId}>
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
