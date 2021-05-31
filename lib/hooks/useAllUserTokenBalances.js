import { batch, contract } from '@pooltogether/etherplex'
import { useUsersAddress } from '@pooltogether/hooks'
import { NO_REFETCH_QUERY_OPTIONS, QUERY_KEYS } from 'lib/constants'
import { useAllCreatedPrizePoolsWithTokens } from 'lib/hooks/useAllCreatedPrizePoolsWithTokens'
import { useReadProvider } from '@pooltogether/hooks'
import { useQuery } from 'react-query'
import ERC20Abi from 'abis/ERC20Abi'
import { ethers } from 'ethers'
import { useNetwork } from 'lib/hooks/useNetwork'

export const useAllUserTokenBalances = () => {
  const { data: prizePools, isFetched: prizePoolsIsFetched } = useAllCreatedPrizePoolsWithTokens()
  const chainId = useNetwork()
  const { data: provider, isFetched: readProviderIsLoaded } = useReadProvider(chainId)
  const usersAddress = useUsersAddress()

  return useQuery(
    [QUERY_KEYS.useAllUserTokenBalances, prizePools, usersAddress],
    async () => await getAllUserTokenBalances(provider, prizePools, usersAddress),
    // @ts-ignore
    {
      ...NO_REFETCH_QUERY_OPTIONS,
      enabled: readProviderIsLoaded && prizePoolsIsFetched,
      staleTime: Infinity
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
        ticketContract.totalSupply().name().decimals().symbol(),
        tokenContract.name().decimals().symbol()
      )

      if (usersAddress) {
        batchRequests.push(
          ticketContract.balanceOf(usersAddress),
          tokenContract.balanceOf(usersAddress)
        )
      }
    }

    const values = await batch(provider, ...batchRequests)

    for (const prizePool of prizePools) {
      const { ticket, token } = prizePool

      const ticketTotalSupplyUnformatted = values[ticket].totalSupply[0]
      const ticketDecimals = values[ticket].decimals[0]
      const ticketTotalSupply = ethers.utils.formatUnits(
        ticketTotalSupplyUnformatted,
        ticketDecimals
      )

      const tokenDecimals = values[token].decimals[0]

      tokenBalances[ticket] = {
        totalSupply: ticketTotalSupply,
        name: values[ticket].name[0],
        decimals: ticketDecimals,
        symbol: values[ticket].symbol[0]
      }
      tokenBalances[token] = {
        name: values[token].name[0],
        decimals: tokenDecimals,
        symbol: values[token].symbol[0]
      }

      if (usersAddress) {
        const ticketBalanceUnformatted = values[ticket].balanceOf[0]
        const ticketBalance = ethers.utils.formatUnits(ticketBalanceUnformatted, ticketDecimals)
        tokenBalances[ticket].balance = ticketBalance
        tokenBalances[ticket].balanceUnformatted = ticketBalanceUnformatted

        const tokenBalanceUnformatted = values[token].balanceOf[0]
        const tokenBalance = ethers.utils.formatUnits(tokenBalanceUnformatted, tokenDecimals)
        tokenBalances[token].balance = tokenBalance
        tokenBalances[token].balanceUnformatted = tokenBalanceUnformatted
      }
    }

    return tokenBalances
  } catch (e) {
    console.error(e.message)
    return {}
  }
}
