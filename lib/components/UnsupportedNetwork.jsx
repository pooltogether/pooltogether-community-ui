import React from 'react'
import classnames from 'classnames'

import { SUPPORTED_NETWORKS } from 'lib/constants'
import { chainIdToName, networkColorClassname } from 'lib/utils/networks'

export const UnsupportedNetwork = (props) => {
  const { chainId, networkName } = props
  return (
    <div className='flex flex-col text-center my-auto'>
      <h1 className='mb-8'>⚠️ Unsupported network ⚠️</h1>
      <div>
        You're currently connected to <Network name={networkName} chainId={chainId} />.
      </div>
      <div className='mb-4'>
        Please connect your wallet to one of the following supported networks:
      </div>
      <ul>
        {SUPPORTED_NETWORKS.map((network) => {
          if ([31337, 1234].includes(network)) return null
          return (
            <li className='ml-2 xs:ml-4' key={network}>
              <Network chainId={network} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

const Network = (props) => (
  <span className={classnames('capitalize', networkColorClassname(props.chainId))}>
    <b>{chainIdToName(props.chainId)}</b>
    <small className='ml-1'>{`network id: ${props.chainId}`}</small>
  </span>
)
