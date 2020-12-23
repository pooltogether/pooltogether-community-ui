import React, { useState } from 'react'
import { useContext, useEffect } from 'react'
import { atom, useAtom } from 'jotai'
import { ethers } from 'ethers'

import { BLOCK_NUMBERS, CONTRACT_ADDRESSES, PRIZE_POOL_TYPE } from 'lib/constants'
import { poolAddressesAtom } from 'lib/hooks/usePoolAddresses'
import { networkAtom } from 'lib/hooks/useNetwork'

import ProxyFactory from '@pooltogether/pooltogether-contracts/abis/ProxyFactory'
import { EMPTY_ERROR_STATE, errorStateAtom } from 'lib/components/PoolData'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { Button } from 'lib/components/Button'
import { useReadProvider } from 'lib/hooks/useReadProvider'

export const prizePoolTypeAtom = atom('')
export const prizePoolTypeOverrideAtom = atom('')

export const usePrizePoolType = () => {
  const [jotaiPrizePoolType, setPrizePoolType] = useAtom(prizePoolTypeAtom)
  const [poolAddresses] = useAtom(poolAddressesAtom)
  const [errorState, setErrorState] = useAtom(errorStateAtom)
  const [network] = useAtom(networkAtom)
  const walletContext = useContext(WalletContext)
  const provider = useReadProvider()

  const [prizePoolTypeOverride, setPrizePoolTypeOverride] = useAtom(prizePoolTypeOverrideAtom)

  const { prizePool } = poolAddresses

  useEffect(() => {
    if (!prizePool || !provider || prizePoolTypeOverride) return

    const determinePoolType = async () => {
      const mostRecentBlockNumber = await provider.getBlockNumber()

      try {
        let prizePoolType

        // Check Compound Prize Pool Proxy Factory for an event emitting the given address
        prizePoolType = await checkPrizePoolProxyType(
          provider,
          prizePool,
          CONTRACT_ADDRESSES[network.id].COMPOUND_PRIZE_POOL_PROXY,
          BLOCK_NUMBERS[network.id].COMPOUND_PRIZE_POOL_PROXY,
          mostRecentBlockNumber,
          PRIZE_POOL_TYPE.compound
        )
        if (prizePoolType) {
          setPrizePoolType(prizePoolType)
          return
        }

        // Check Stake Prize Pool Proxy Factory for an event emitting the given address
        prizePoolType = await checkPrizePoolProxyType(
          provider,
          prizePool,
          CONTRACT_ADDRESSES[network.id].STAKE_PRIZE_POOL_PROXY,
          BLOCK_NUMBERS[network.id].STAKE_PRIZE_POOL_PROXY,
          mostRecentBlockNumber,
          PRIZE_POOL_TYPE.stake
        )
        if (prizePoolType) {
          setPrizePoolType(prizePoolType)
          return
        }

        // TODO: Invalid contract versions, ideally we can redirect to somewhere more helpful
        if (!prizePoolType && !jotaiPrizePoolType) {
          setErrorState({
            error: true,
            errorMessage: ``,
            view: (
              <IncompatibleVersion
                prizePool={prizePool}
                setPrizePoolType={setPrizePoolType}
                setPrizePoolTypeOverride={setPrizePoolTypeOverride}
              />
            )
          })
          return
        }
      } catch (e) {
        console.error(e)
        return
      }
    }

    determinePoolType()
  }, [prizePool, provider, network.id])

  return [jotaiPrizePoolType, setPrizePoolType]
}

const checkPrizePoolProxyType = async (
  provider,
  prizePoolAddress,
  prizePoolProxyContractAddress,
  prizePoolProxyContractBlockNumber,
  mostRecentBlockNumber,
  type
) => {
  const prizePoolProxyContract = new ethers.Contract(
    prizePoolProxyContractAddress,
    ProxyFactory,
    provider
  )
  const proxyCreatedEventFilter = prizePoolProxyContract.filters.ProxyCreated()
  const proxyLogs = await provider.getLogs({
    ...proxyCreatedEventFilter,
    fromBlock: prizePoolProxyContractBlockNumber,
    toBlock: mostRecentBlockNumber
  })

  if (
    proxyLogs
      .map((d) => prizePoolProxyContract.interface.parseLog(d).values.proxy)
      .includes(prizePoolAddress)
  ) {
    return type
  }

  return
}

const IncompatibleVersion = (props) => {
  const { prizePool, setPrizePoolType, setPrizePoolTypeOverride } = props
  const [errorState, setErrorState] = useAtom(errorStateAtom)
  const [network] = useAtom(networkAtom)

  return (
    <>
      <h1 className='text-orange-600'>Warning</h1>
      <h3>
        Reference app v3.1.0 is incompatible with the Prize Pool at address {prizePool} on{' '}
        {network.name}.
      </h3>
      <hr />
      <h4>Is {network.name} the correct network for this contract?</h4>
      <div className='flex mt-4'>
        <Button className='mx-4' color='secondary' href={`/pools/mainnet/${prizePool}`}>
          Mainnet
        </Button>
        <Button className='mx-4' color='secondary' href={`/pools/rinkeby/${prizePool}`}>
          Rinkeby
        </Button>
      </div>

      <hr />
      <h4>Only proceed if you know what you're doing.</h4>
      <p>{prizePool} is a:</p>
      <div className='flex'>
        <Button
          color='secondary'
          onClick={(e) => {
            e.preventDefault()
            setPrizePoolTypeOverride(PRIZE_POOL_TYPE.compound)
            setPrizePoolType(PRIZE_POOL_TYPE.compound)
            setErrorState(EMPTY_ERROR_STATE)
          }}
        >
          Compound Yield Pool
        </Button>
        <Button
          color='secondary'
          className='ml-4'
          onClick={(e) => {
            e.preventDefault()
            setPrizePoolTypeOverride(PRIZE_POOL_TYPE.compound)
            setPrizePoolType(PRIZE_POOL_TYPE.stake)
            setErrorState(EMPTY_ERROR_STATE)
          }}
        >
          Staking Pool
        </Button>
      </div>
    </>
  )
}
