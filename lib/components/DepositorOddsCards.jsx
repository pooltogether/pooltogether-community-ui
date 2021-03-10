import React from 'react'
import { useAtom } from 'jotai'

import { DEFAULT_TOKEN_PRECISION } from 'lib/constants'
import { Card, CardPrimaryText, CardTitle } from 'lib/components/Card'
import { poolChainValuesAtom } from 'lib/hooks/usePoolChainValues'
import { userChainValuesAtom } from 'lib/hooks/useUserChainValues'
import { calculateOdds } from 'lib/utils/calculateOdds'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { getPrecision, numberWithCommas } from 'lib/utils/numberWithCommas'
import { ethers } from 'ethers'

export const DepositorOddsCards = (props) => {
  return (
    <>
      <div className='flex '>
        <TicketCard />
        <BalanceCard />
      </div>
      <div className='flex mb-4 sm:mb-10'>
        <OddsCard />
        <TotalDepositsCard />
      </div>
    </>
  )
}

const TicketCard = () => {
  const [poolChainValues] = useAtom(poolChainValuesAtom)
  const [userChainValues] = useAtom(userChainValuesAtom)
  const balance = displayAmountInEther(userChainValues.usersTicketBalance, {
    precision: 0,
    decimals: poolChainValues.ticketDecimals
  })
  const symbol = poolChainValues.ticketSymbol

  return (
    <Card small className='text-center' marginClasses='mb-4 mr-2'>
      <CardTitle>My tickets</CardTitle>
      <CardPrimaryText small>{`${balance} ${symbol}`}</CardPrimaryText>
    </Card>
  )
}

const OddsCard = () => {
  const [poolChainValues] = useAtom(poolChainValuesAtom)
  const [userChainValues] = useAtom(userChainValuesAtom)
  const odds = calculateOdds(
    userChainValues.usersTicketBalance,
    poolChainValues.ticketTotalSupply,
    poolChainValues.ticketDecimals,
    poolChainValues.numberOfWinners
  )

  if (!odds) {
    return (
      <Card small className='text-center' marginClasses='mr-2'>
        <CardTitle>My winning odds</CardTitle>
        <CardPrimaryText small>0</CardPrimaryText>
      </Card>
    )
  }

  const formattedOdds = numberWithCommas(odds, { precision: 2 })

  return (
    <Card small className='text-center' marginClasses='mr-2'>
      <CardTitle>My winning odds</CardTitle>
      <CardPrimaryText small>1 in {formattedOdds}</CardPrimaryText>
    </Card>
  )
}

const BalanceCard = () => {
  const [poolChainValues] = useAtom(poolChainValuesAtom)
  const [userChainValues] = useAtom(userChainValuesAtom)
  const balance = displayAmountInEther(userChainValues.usersTokenBalance, {
    precision: 2,
    decimals: poolChainValues.tokenDecimals
  })
  const symbol = poolChainValues.tokenSymbol

  return (
    <Card small className='text-center' marginClasses='mb-4 ml-2'>
      <CardTitle>My wallet balance</CardTitle>
      <CardPrimaryText small>{`${balance} ${symbol}`}</CardPrimaryText>
    </Card>
  )
}

const TotalDepositsCard = () => {
  const [poolChainValues] = useAtom(poolChainValuesAtom)
  const supplyFormatted = ethers.utils.formatUnits(
    poolChainValues.ticketTotalSupply,
    poolChainValues.tokenDecimals
  )
  const totalSupply = numberWithCommas(supplyFormatted, {
    precision: getPrecision(supplyFormatted)
  })
  const symbol = poolChainValues.tokenSymbol

  return (
    <Card small className='text-center' marginClasses='ml-2'>
      <CardTitle>Total deposits</CardTitle>
      <CardPrimaryText small>{`${totalSupply} ${symbol}`}</CardPrimaryText>
    </Card>
  )
}
