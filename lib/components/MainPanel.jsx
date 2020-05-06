import React, { useContext, useEffect, useState } from 'react'
import classnames from 'classnames'
import { ethers } from 'ethers'
import { batch, contract } from '@pooltogether/etherplex'

import PeriodicPrizePoolAbi from 'lib/abis/PeriodicPrizePoolAbi'
import TicketAbi from 'lib/abis/TicketAbi'

import { ADDRESSES } from 'lib/constants'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { digChainIdFromWalletState } from 'lib/utils/digChainIdFromWalletState'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

const getTicketValues = async (walletContext, setTicketValues) => {
  const provider = walletContext.state.provider
  if (provider) {
    const chainId = digChainIdFromWalletState(walletContext)
    const poolContractAddress = ADDRESSES[chainId]['POOL_CONTRACT_ADDRESS']
    const etherplexPoolContract = contract(
      'pool',
      PeriodicPrizePoolAbi,
      poolContractAddress
    )

    try {
      const poolBatch = await batch(
        provider,
        etherplexPoolContract
          .interestPool()
          .ticket()
          .sponsorship()
          .prizeStrategy()
      )
      console.log(poolBatch)

      const {
        interestPool,
        ticket,
        sponsorship,
        prizeStrategy,
      } = poolBatch.pool

      if (ticket) {
        console.log(ticket[0])
        const etherplexTicketContract = contract(
          'ticket',
          TicketAbi,
          ticket[0]
        )

        const usersAddress = walletContext.state.address
        const ticketValues = await batch(
          provider,
          etherplexTicketContract
            .allowance(usersAddress, poolContractAddress)
            .balanceOf(usersAddress)
            .name()
            .symbol()
            .totalSupply()
        )
        console.log(ticketValues)
      }
    } catch (e) {
      console.log(e.message)
      // console.error(e)
    }
    
  } else {
    // console.warn('no provider?')
  }
}

const getEthBalance = async (walletContext, setEthBalance) => {
  const provider = walletContext.state.provider
  const usersAddress = walletContext.state.address
  if (provider && usersAddress) {
    const ethBalance = await provider.getBalance(usersAddress)
    setEthBalance(ethBalance)
  }
}

export const MainPanel = (props) => {
  const walletContext = useContext(WalletContext)
  const [ethBalance, setEthBalance] = useState()
  const [ticketValues, setTicketValues] = useState({
    balanceOf: ethers.utils.bigNumberify(0)
  })

  useEffect(() => {
    getTicketValues(walletContext, setTicketValues)
  }, [walletContext])

  useEffect(() => {
    getEthBalance(walletContext, setEthBalance)
  }, [walletContext])
  
  let usersTokenBalance = ethers.utils.bigNumberify(0)

  return <>
    <div
      className={classnames(
        'bg-purple-1000 py-8 px-8 sm:p-8 sm:pb-16 lg:pt-12 rounded-xl text-base sm:text-lg mb-12',
        '-mx-8 sm:-mx-8 lg:-mx-12',
      )}
    >
      <strong>Your ETH Balance:</strong>
      <br />
      {ethBalance && displayAmountInEther(ethBalance)}
      <br />
      <br />

      <strong>Your Token Balance:</strong>
      <br />
      {usersTokenBalance.toString()}
      <br />

      <br />
      <strong>Your Pool Balance:</strong>
      <br />
      {ticketValues.balanceOf && displayAmountInEther(ticketValues.balanceOf)}
      {/* <DepositPanel
      /> */}
    </div>
  </>
}

