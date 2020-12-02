import { useContext, useEffect } from 'react'
import { useAtom } from 'jotai'
import { ethers } from 'ethers'
import { batch, contract } from '@pooltogether/etherplex'

import { WalletContext } from 'lib/components/WalletContextProvider'
import {
  poolAddressesAtom,
  poolChainValuesAtom,
  prizePoolTypeAtom,
  userChainValuesAtom
} from 'lib/components/PoolUI'

import ERC20Abi from 'ERC20Abi'
import CTokenAbi from '@pooltogether/pooltogether-contracts/abis/CTokenInterface'
import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'
import SingleRandomWinnerAbi from '@pooltogether/pooltogether-contracts/abis/SingleRandomWinner'
import { PrizePoolType } from 'lib/constants'

export const useUserChainValues = () => {
  const [poolAddresses] = useAtom(poolAddressesAtom)
  const [usersAddress] = useAtom(usersAddressAtom)
  const [userChainValues, setUserChainValues] = useAtom(userChainValuesAtom)
  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider

  const { token, prizePool, ticket } = poolAddresses

  useEffect(() => {
    const fetchUserChainData = async () => {
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
          setUserChainValues({
            error: true,
            errorMessage: e.message
          })

          console.warn(e.message)
        }
      }
    }
    fetchUserChainData()
  }, [])
}
