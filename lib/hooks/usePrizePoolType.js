import { useEffect } from 'react'
import { atom, useAtom } from 'jotai'
import { ethers } from 'ethers'

import { BLOCK_NUMBERS, CONTRACT_ADDRESSES, PRIZE_POOL_TYPE } from 'lib/constants'
import { poolAddressesAtom } from 'lib/hooks/usePoolAddresses'
import { networkAtom } from 'lib/hooks/useNetwork'

import ProxyFactory from '@pooltogether/pooltogether-contracts/abis/ProxyFactory'
import { useReadProvider } from 'lib/hooks/useReadProvider'

export const prizePoolTypeAtom = atom('')

export const usePrizePoolType = () => {
  const [prizePoolType, setPrizePoolType] = useAtom(prizePoolTypeAtom)
  const [poolAddresses] = useAtom(poolAddressesAtom)
  const [network] = useAtom(networkAtom)
  const provider = useReadProvider()

  const { prizePool } = poolAddresses

  useEffect(() => {
    if (!prizePool || !provider) return

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
        }

        // TODO: if no type set, display incorrect version screen
      } catch (e) {
        console.error(e)
        return
      }
    }

    determinePoolType()
  }, [prizePool, provider])

  return [prizePoolType, setPrizePoolType]
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
