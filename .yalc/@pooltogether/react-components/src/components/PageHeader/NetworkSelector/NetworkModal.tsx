import React from 'react'
import classnames from 'classnames'
import {
  useIsWalletMetamask,
  useAddNetworkToMetamask,
  useIsWalletOnNetwork,
  useIsWalletOnSupportedNetwork
} from '@pooltogether/hooks'
import { getNetworkNiceNameByChainId } from '@pooltogether/utilities'
import { Modal } from '../../Modal/Modal'
import { NetworkIcon } from '../../Icons/NetworkIcon'

export const NetworkModal = (props) => {
  const { t, isOpen, closeModal, supportedNetworks, chainId, wallet, network } = props

  const isWalletMetamask = useIsWalletMetamask(wallet)
  const currentNetworkName = getNetworkNiceNameByChainId(chainId)
  const isWalletOnSupportedNetwork = useIsWalletOnSupportedNetwork(chainId, supportedNetworks)

  if (isWalletMetamask) {
    return (
      <Modal isOpen={isOpen} closeModal={closeModal} label='network modal'>
        <Container>
          <Header>{t?.('chooseANetwork') || 'Choose a Network'}</Header>
          <Description>
            {t?.('selectASupportedNetworkMetamask') ||
              'Select a supported network to be prompted to switch in your MetaMask wallet.'}
          </Description>
          {supportedNetworks.map((chainId) => (
            <NetworkButton
              network={network}
              t={t}
              key={chainId}
              chainId={chainId}
              closeModal={closeModal}
            />
          ))}
          <CurrentlyConnectedTo
            t={t}
            currentNetworkName={currentNetworkName}
            isWalletOnSupportedNetwork={isWalletOnSupportedNetwork}
          />
        </Container>
      </Modal>
    )
  }

  return (
    <Modal isOpen={isOpen} closeModal={closeModal} label='network modal'>
      <Container>
        <Header>{t?.('supportedNetworks') || 'Suported Networks'}</Header>
        <Description>
          {t?.('pleaseSwitchToASupportedNetwork') ||
            'Please switch to a supported network in your wallet.'}
        </Description>
        {supportedNetworks.map((chainId) => (
          <NetworkItem network={network} t={t} key={chainId} chainId={chainId} />
        ))}
        <CurrentlyConnectedTo
          t={t}
          currentNetworkName={currentNetworkName}
          isWalletOnSupportedNetwork={isWalletOnSupportedNetwork}
        />
      </Container>
    </Modal>
  )
}

const Container = (props) => <div className='flex flex-col h-full p-4'>{props.children}</div>
const Header = (props) => (
  <h5 className='font-semibold uppercase text-inverse mb-2'>{props.children}</h5>
)
const Description = (props) => <p className='mb-4 text-sm text-accent-1'>{props.children}</p>
const CurrentlyConnectedTo = (props) => (
  <p className='text-xxxs mt-auto'>
    {props.t?.('currentlyConnectedTo') || 'Currently connected to:'}{' '}
    <b className={classnames({ 'ml-1 text-red': !props.isWalletOnSupportedNetwork })}>
      {props.currentNetworkName}
    </b>
  </p>
)

const NetworkItem = (props) => {
  const { network, chainId } = props

  const isCurrentNetwork = useIsWalletOnNetwork(network, chainId)
  const networkName = getNetworkNiceNameByChainId(chainId)

  return (
    <div
      className={classnames('flex justify-center mb-4 last:mb-0 w-full text-center py-2 rounded', {
        'pool-gradient-1': isCurrentNetwork,
        'bg-body': !isCurrentNetwork
      })}
    >
      <NetworkIcon chainId={chainId} className='mr-2' />
      <span>{networkName}</span>
    </div>
  )
}

const NetworkButton = (props) => {
  const { network, chainId, closeModal } = props

  const isCurrentNetwork = useIsWalletOnNetwork(network, chainId)
  const networkName = getNetworkNiceNameByChainId(chainId)
  const addNetwork = useAddNetworkToMetamask(chainId, { onSuccess: closeModal })

  return (
    <div className='flex mb-4 last:mb-0'>
      <button
        className={classnames(
          'w-full flex items-center justify-center py-2 rounded transition hover:text-white',
          {
            'pool-gradient-1 text-white': isCurrentNetwork,
            'bg-body border border-body hover:bg-pt-purple-bright hover:border-accent-3': !isCurrentNetwork
          }
        )}
        type='button'
        onClick={addNetwork}
      >
        <NetworkIcon chainId={chainId} className='mr-2' />
        <span>{networkName}</span>
      </button>
    </div>
  )
}
