import { batch, contract } from '@pooltogether/etherplex'
import { QUERY_KEYS } from 'lib/constants'
import { useAllCreatedPrizePoolsWithTokens } from 'lib/hooks/useAllCreatedPrizePoolsWithTokens'
import { useReadProvider } from 'lib/hooks/useReadProvider'
import { useQuery } from 'react-query'
import ERC20Abi from 'ERC20Abi'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { useContext } from 'react'
import { ethers } from 'ethers'

export const useAllUserTokenBalances = () => {
  const { data: prizePools, isFetched: prizePoolsIsFetched } = useAllCreatedPrizePoolsWithTokens()
  const { readProvider: provider, isLoaded: readProviderIsLoaded } = useReadProvider()
  const walletContext = useContext(WalletContext)
  const usersAddress = walletContext._onboard.getState().address

  return useQuery(
    [QUERY_KEYS.useAllUserTokenBalances, prizePools, usersAddress],
    async () => getAllUserTokenBalances(provider, prizePools, usersAddress),
    {
      enabled: readProviderIsLoaded && prizePoolsIsFetched,
      refetchInterval: false,
      refetchOnWindowFocus: false
    }
  )
}

const getAllUserTokenBalances = async (provider, prizePools, usersAddress) => {
  try {
    const tokenBalances = {}

    const batchRequests = []
    for (const prizePool of prizePools) {
      const { ticket, token } = prizePool
      const ticketContract = contract(ticket, ERC20Abi, ticket)
      const tokenContract = contract(token, ERC20Abi, token)
      batchRequests.push(
        ticketContract
          .balanceOf(usersAddress)
          .totalSupply()
          .name()
          .decimals()
          .symbol(),
        tokenContract
          .name()
          .decimals()
          .symbol()
      )

      if (usersAddress) {
        batchRequests.push(
          ticketContract.balanceOf(usersAddress),
          tokenContract.balanceOf(usersAddress)
        )
      }
    }

    const values = await batch(provider, ...batchRequests)
    console.log(values)

    for (const prizePool of prizePools) {
      const { ticket, token } = prizePool

      const ticketBalanceUnformatted = values[ticket].balanceOf[0]
      const ticketTotalSupplyUnformatted = values[ticket].totalSupply[0]
      const ticketDecimals = values[ticket].decimals[0]
      const ticketBalance = ethers.utils.formatUnits(ticketBalanceUnformatted, ticketDecimals)
      const ticketTotalSupply = ethers.utils.formatUnits(
        ticketTotalSupplyUnformatted,
        ticketDecimals
      )

      const tokenBalanceUnformatted = values[token].balanceOf[0]
      const tokenDecimals = values[token].decimals[0]
      const tokenBalance = ethers.utils.formatUnits(tokenBalanceUnformatted, tokenDecimals)

      tokenBalances[ticket] = {
        balance: ticketBalance,
        balanceUnformatted: ticketBalanceUnformatted,
        totalSupply: ticketTotalSupply,
        name: values[ticket].name[0],
        decimals: ticketDecimals,
        symbol: values[ticket].symbol[0]
      }
      tokenBalances[token] = {
        balance: tokenBalance,
        balanceUnformatted: tokenBalanceUnformatted,
        name: values[token].name[0],
        decimals: tokenDecimals,
        symbol: values[token].symbol[0]
      }
    }

    return tokenBalances
  } catch (e) {
    console.error(e.message)
    return {}
  }
}
