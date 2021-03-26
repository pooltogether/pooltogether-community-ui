import { useContext, useEffect } from 'react'
import { atom, useAtom } from 'jotai'
import { batch, contract } from '@pooltogether/etherplex'

import { WalletContext } from 'lib/components/WalletContextProvider'
import { errorStateAtom, getDataFetchingErrorMessage } from 'lib/components/PoolData'

import ERC20Abi from 'abis/ERC20Abi'
import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'
import { ethers } from 'ethers'
import { useInterval } from 'beautiful-react-hooks'
import { DATA_REFRESH_POLLING_INTERVAL } from 'lib/constants'
import { useReadProvider } from 'lib/hooks/useReadProvider'
import { poolAddressesAtom } from 'lib/hooks/usePoolAddresses'
import { usersAddressAtom } from 'lib/hooks/useUsersAddress'
import { useNetwork } from 'lib/hooks/useNetwork'
import { tokenSupportsAllowance } from 'lib/utils/tokenSupportsAllowance'

const EMPTY_USER_CHAIN_VALUES = {
  loading: true,
  usersTicketBalance: ethers.constants.Zero,
  usersTokenAllowance: ethers.constants.Zero,
  usersTokenBalance: ethers.constants.Zero,
  usersTimelockBalanceAvailableAt: null,
  usersTimelockBalance: null,
  underlyingTokenSupportsAllowance: null,
  underlyingTokenIsApproved: null
}

export const userChainValuesAtom = atom(EMPTY_USER_CHAIN_VALUES)

export const useUserChainValues = () => {
  const [poolAddresses] = useAtom(poolAddressesAtom)
  const [usersAddress] = useAtom(usersAddressAtom)
  const { chainId } = useNetwork()
  const [userChainValues, setUserChainValues] = useAtom(userChainValuesAtom)
  const [errorState, setErrorState] = useAtom(errorStateAtom)
  const { readProvider: provider, isLoaded: readProviderLoaded } = useReadProvider()

  useEffect(() => {
    if (!readProviderLoaded || !poolAddresses) return

    if (!usersAddress) {
      setUserChainValues(EMPTY_USER_CHAIN_VALUES)
      return
    }

    fetchUserChainData(
      provider,
      chainId,
      poolAddresses,
      usersAddress,
      setUserChainValues,
      setErrorState
    )
  }, [readProviderLoaded, provider, poolAddresses, usersAddress])

  useInterval(() => {
    if (!readProviderLoaded || !poolAddresses || !usersAddress) return

    fetchUserChainData(
      provider,
      chainId,
      poolAddresses,
      usersAddress,
      setUserChainValues,
      setErrorState
    )
  }, DATA_REFRESH_POLLING_INTERVAL)

  return [userChainValues, setUserChainValues]
}

export const fetchUserChainData = async (
  provider,
  chainId,
  poolAddresses,
  usersAddress,
  setUserChainValues,
  setErrorState
) => {
  const { token, prizePool, ticket } = poolAddresses

  if (token && prizePool && ticket) {
    try {
      const etherplexPrizePoolContract = contract('prizePool', PrizePoolAbi, prizePool)
      const etherplexTicketContract = contract('ticket', ERC20Abi, ticket)
      const etherplexTokenContract = contract('token', ERC20Abi, token)

      const batchRequests = [
        etherplexPrizePoolContract
          .timelockBalanceOf(usersAddress)
          .timelockBalanceAvailableAt(usersAddress),
        etherplexTicketContract.balanceOf(usersAddress),
        etherplexTokenContract.balanceOf(usersAddress)
      ]

      const underlyingTokenSupportsAllowance = tokenSupportsAllowance(chainId, token)

      if (underlyingTokenSupportsAllowance) {
        batchRequests.push(etherplexTokenContract.allowance(usersAddress, prizePool))
      }

      const values = await batch(provider, ...batchRequests)

      const usersTokenAllowance = values.token.allowance?.[0] || ethers.constants.Zero

      setUserChainValues((existingValues) => ({
        ...existingValues,
        usersTicketBalance: values.ticket.balanceOf[0],
        usersTokenAllowance,
        usersTokenBalance: values.token.balanceOf[0],
        usersTimelockBalanceAvailableAt: values.prizePool.timelockBalanceAvailableAt[0],
        usersTimelockBalance: values.prizePool.timelockBalanceOf[0],
        underlyingTokenSupportsAllowance: tokenSupportsAllowance(chainId, token),
        underlyingTokenIsApproved: tokenSupportsAllowance(chainId, token)
          ? !usersTokenAllowance.isZero()
          : true,
        loading: false
      }))
    } catch (e) {
      setErrorState({
        error: true,
        errorMessage: getDataFetchingErrorMessage(prizePool, `user's chain values`, e.message)
      })
      return
    }
  }
}
