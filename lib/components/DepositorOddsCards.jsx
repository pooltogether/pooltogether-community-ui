import React from 'react'
import { useAtom } from 'jotai'

import { Card, CardPrimaryText, CardTitle } from 'lib/components/Card'
import { poolChainValuesAtom } from 'lib/hooks/usePoolChainValues'
import { userChainValuesAtom } from 'lib/hooks/useUserChainValues'
import { calculateOdds } from 'lib/utils/calculateOdds'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

export const DepositorOddsCards = (props) => {
  return (
    <div className='flex'>
      <TicketCard />
      <OddsCard />
      <BalanceCard />
    </div>
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
    <Card className='mr-1 sm:mr-4 text-center'>
      <CardTitle>My tickets</CardTitle>
      <CardPrimaryText>{`${balance} ${symbol}`}</CardPrimaryText>
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
      <Card className='mx-1 sm:mx-4 text-center'>
        <CardTitle>My winning odds</CardTitle>
        <CardPrimaryText>0</CardPrimaryText>
      </Card>
    )
  }

  const formattedOdds = numberWithCommas(odds, { precision: 2 })

  return (
    <Card className='mx-1 sm:mx-4 text-center'>
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
    <Card className='ml-1 sm:ml-4 text-center'>
      <CardTitle>My wallet balance</CardTitle>
      <CardPrimaryText>{`${balance} ${symbol}`}</CardPrimaryText>
    </Card>
  )
}
