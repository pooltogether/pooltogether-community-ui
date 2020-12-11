import { useContext, useEffect } from 'react'
import { atom, useAtom } from 'jotai'
import { batch, contract } from '@pooltogether/etherplex'

import { WalletContext } from 'lib/components/WalletContextProvider'
import { errorStateAtom, getDataFetchingErrorMessage } from 'lib/components/PoolData'

import ERC20Abi from 'ERC20Abi'
import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'
import { ethers } from 'ethers'
import { useInterval } from 'beautiful-react-hooks'
import { DATA_REFRESH_POLLING_INTERVAL } from 'lib/constants'
import { useReadProvider } from 'lib/hooks/useReadProvider'
import { poolAddressesAtom } from 'lib/hooks/usePoolAddresses'
import { usersAddressAtom } from 'lib/hooks/useUsersAddress'

export const userChainValuesAtom = atom({
  loading: true,
  usersTicketBalance: ethers.utils.bigNumberify(0),
  usersTokenAllowance: ethers.utils.bigNumberify(0),
  usersTokenBalance: ethers.utils.bigNumberify(0)
})

export const useUserChainValues = () => {
  const [poolAddresses] = useAtom(poolAddressesAtom)
  const [usersAddress] = useAtom(usersAddressAtom)
  const [userChainValues, setUserChainValues] = useAtom(userChainValuesAtom)
  const [errorState, setErrorState] = useAtom(errorStateAtom)
  const provider = useReadProvider()

  useEffect(() => {
    if (!provider || !poolAddresses || !usersAddress) return

    fetchUserChainData(provider, poolAddresses, usersAddress, setUserChainValues, setErrorState)
  }, [provider, poolAddresses, usersAddress])

  useInterval(() => {
    if (!provider || !poolAddresses || !usersAddress) return

    fetchUserChainData(provider, poolAddresses, usersAddress, setUserChainValues, setErrorState)
  }, DATA_REFRESH_POLLING_INTERVAL)

  return [userChainValues, setUserChainValues]
}

export const fetchUserChainData = async (
  provider,
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

      const values = await batch(
        provider,
        etherplexPrizePoolContract
          .timelockBalanceOf(usersAddress)
          .timelockBalanceAvailableAt(usersAddress),
        etherplexTicketContract.balanceOf(usersAddress),
        etherplexTokenContract.balanceOf(usersAddress).allowance(usersAddress, prizePool)
      )

      setUserChainValues((existingValues) => ({
        ...existingValues,
        usersTicketBalance: values.ticket.balanceOf[0],
        usersTokenAllowance: values.token.allowance[0],
        usersTokenBalance: values.token.balanceOf[0],
        usersTimelockBalanceAvailableAt: values.prizePool.timelockBalanceAvailableAt[0],
        usersTimelockBalance: values.prizePool.timelockBalanceOf[0],
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
