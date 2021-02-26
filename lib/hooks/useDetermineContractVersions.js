import React from 'react'
import { batch, contract } from '@pooltogether/etherplex'
import { atom, useAtom } from 'jotai'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'

import { errorStateAtom } from 'lib/components/PoolData'
import { CONTRACTS, CONTRACT_VERSIONS, PRIZE_POOL_TYPE } from 'lib/constants'
import { networkAtom } from 'lib/hooks/useNetwork'
import { poolAddressesAtom } from 'lib/hooks/usePoolAddresses'
import { useReadProvider } from 'lib/hooks/useReadProvider'
import { ButtonLink } from 'lib/components/ButtonLink'

export const contractVersionsAtom = atom({})
export const prizePoolTypeAtom = atom((get) => {
  const contract = get(contractVersionsAtom)?.prizePool?.contract

  switch (contract) {
    case CONTRACTS.compound: {
      return PRIZE_POOL_TYPE.compound
    }
    case CONTRACTS.stake: {
      return PRIZE_POOL_TYPE.stake
    }
    default: {
      return null
    }
  }
})

export const useDetermineContractVersions = () => {
  const [errorState, setErrorState] = useAtom(errorStateAtom)
  const [contractVersions, setContractVersions] = useAtom(contractVersionsAtom)
  const [network] = useAtom(networkAtom)
  const [poolAddresses] = useAtom(poolAddressesAtom)
  const { readProvider: provider, isLoaded: readProviderLoaded } = useReadProvider()
  const prizePoolAddress = poolAddresses.prizePool

  useEffect(() => {
    if (!readProviderLoaded) return
    setErrorState({})
    getContractVersions(provider, network.id, prizePoolAddress, setContractVersions, setErrorState)
  }, [readProviderLoaded, provider, network.id, prizePoolAddress])

  return null
}

/**
 * Sets the versions based on bytecode stored in current-pool-data.
 * Only checks Prize Pool & Prize Strategy.
 * @param {*} provider
 * @param {*} networkId
 * @param {*} prizePoolAddress
 * @param {*} setContractVersions
 * @param {*} setErrorState
 */
const getContractVersions = async (
  provider,
  networkId,
  prizePoolAddress,
  setContractVersions,
  setErrorState
) => {
  const prizePoolByteCode = await provider.getCode(prizePoolAddress)
  let prizePoolVersion = CONTRACT_VERSIONS[networkId][prizePoolByteCode]

  const providerNetwork = await provider.getNetwork()

  if (providerNetwork.chainId !== networkId) {
    setContractVersions({})
    return
  }

  if (!prizePoolVersion) {
    setErrorState({
      error: true,
      view: <IncompatibleContract address={prizePoolAddress} />
    })
    // Set a fallback version
    prizePoolVersion = {
      contract: 'StakePrizePool',
      version: '3.2.0'
    }
  }

  const prizePoolContract = contract('prizePool', PrizePoolAbi, prizePoolAddress)
  const prizePoolValues = await batch(provider, prizePoolContract.prizeStrategy())
  const prizeStrategyAddress = prizePoolValues.prizePool.prizeStrategy[0]

  const prizeStrategyByteCode = await provider.getCode(prizeStrategyAddress)
  let prizeStrategyVersion = CONTRACT_VERSIONS[networkId][prizeStrategyByteCode]

  if (!prizeStrategyVersion) {
    setErrorState({
      error: true,
      view: <IncompatibleContract address={prizeStrategyAddress} />
    })
    // Set a fallback version
    prizeStrategyVersion = {
      contract: 'MultipleWinners',
      version: '3.2.0'
    }
  }

  const contractVersions = {
    prizePool: prizePoolVersion,
    prizeStrategy: prizeStrategyVersion
  }

  setContractVersions(contractVersions)
}

const IncompatibleContract = (props) => {
  const { address } = props

  const [errorState, setErrorState] = useAtom(errorStateAtom)
  const [poolAddresses] = useAtom(poolAddressesAtom)
  const [network] = useAtom(networkAtom)

  const { prizePool } = poolAddresses

  return (
    <>
      <div className='text-left mb-10 border-2 border-primary rounded-lg px-7 py-4'>
        <h4 className='text-orange-600'>Warning</h4>
        <h6>
          This version of the app may be incompatible with this contract '{address}' on{' '}
          {network.name}.
        </h6>
        <h6 className='mt-4'>
          Contract version identifiers may need to be added for new pooltogether-contracts versions
          in current-pool-data.
        </h6>
        <hr />
        <h5 className='text-accent-1'>Is {network.name} the correct network for this contract?</h5>
        <div className='flex flex-col mt-2 text-accent-1'>
          {network.name === 'rinkeby' && (
            <h6>
              Possibly try the Mainnet URL:
              <br />
              <ButtonLink className='mt-4' color='secondary' href={`/pools/mainnet/${prizePool}`}>
                Go
              </ButtonLink>
            </h6>
          )}
          {network.name === 'mainnet' && (
            <h6>
              Possibly try the Rinkeby URL:
              <br />
              <ButtonLink className='mt-4' color='secondary' href={`/pools/rinkeby/${prizePool}`}>
                Go
              </ButtonLink>
            </h6>
          )}
        </div>
      </div>
    </>
  )
}
