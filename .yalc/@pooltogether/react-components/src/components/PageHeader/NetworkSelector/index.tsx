import React, { useState } from 'react'

import { NetworkModal } from './NetworkModal'
import { NetworkTrigger } from './NetworkTrigger'

export const NetworkSelector = (props) => {
  const { t, chainId, supportedNetworks, className, isWalletConnected, wallet, network } = props
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {isWalletConnected && (
        <NetworkTrigger
          t={t}
          chainId={chainId}
          openModal={() => setIsOpen(true)}
          className={className}
        />
      )}
      <NetworkModal
        t={t}
        network={network}
        wallet={wallet}
        chainId={chainId}
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
        supportedNetworks={supportedNetworks}
      />
    </>
  )
}
