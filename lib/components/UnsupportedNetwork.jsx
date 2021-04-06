import React from 'react'
import classnames from 'classnames'
import { getChain } from '@pooltogether/evm-chains-extended'

import { SUPPORTED_NETWORKS } from 'lib/constants'
import { useWalletNetwork } from 'lib/hooks/useWalletNetwork'
import { networkColorClassname } from 'lib/utils/networks'

export const UnsupportedNetwork = () => {
  const { walletChainId } = useWalletNetwork()

  return (
    <div className='flex flex-col'>
      <h3 className='mb-4'>⚠️ Unsupported network ⚠️</h3>
      <div className='mb-1'>
        You're currently connected to <Network chainId={walletChainId} />.
      </div>
      <div className='mb-4'>
        Please connect your wallet to one of the following supported networks:
      </div>
      <ul>
        {SUPPORTED_NETWORKS.map((network) => {
          if ([31337, 1234].includes(network)) return null
          return (
            <li key={network}>
              <Network chainId={network} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

const Network = (props) => {
  const { chainId } = props
  let viewName = 'an unknown network'

  try {
    viewName = getChain(chainId)?.name
  } catch (e) {}

  return (
    <span className={classnames(networkColorClassname(props.chainId))}>
      <b>{viewName}</b>
      <small className='ml-1 text-highlight-1'>{`chainId: ${chainId}`}</small>
    </span>
  )
}
