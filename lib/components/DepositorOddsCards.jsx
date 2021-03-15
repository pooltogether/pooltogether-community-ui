import React from 'react'
import { useAtom } from 'jotai'

import { Card, CardPrimaryText, CardTitle } from 'lib/components/Card'
import { poolChainValuesAtom } from 'lib/hooks/usePoolChainValues'
import { userChainValuesAtom } from 'lib/hooks/useUserChainValues'
import { calculateOdds } from 'lib/utils/calculateOdds'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

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

  const symbol = poolChainValues.ticketSymbol
  const decimals = poolChainValues.ticketDecimals
  const balance = numberWithCommas(userChainValues.usersTicketBalance, { decimals })

  return (
    <Card small className='text-center' marginClasses='mb-4 mr-2'>
      <CardTitle>My deposit</CardTitle>
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

  const symbol = poolChainValues.tokenSymbol
  const decimals = poolChainValues.tokenDecimals
  const balance = numberWithCommas(userChainValues.usersTokenBalance, { decimals })

  return (
    <Card small className='text-center' marginClasses='mb-4 ml-2'>
      <CardTitle>My wallet balance</CardTitle>
      <CardPrimaryText small>{`${balance} ${symbol}`}</CardPrimaryText>
    </Card>
  )
}

const TotalDepositsCard = () => {
  const [poolChainValues] = useAtom(poolChainValuesAtom)

  const symbol = poolChainValues.tokenSymbol
  const decimals = poolChainValues.tokenDecimals
  const totalSupply = numberWithCommas(poolChainValues.ticketTotalSupply, { decimals })

  return (
    <Card small className='text-center' marginClasses='ml-2'>
      <CardTitle>Total deposits</CardTitle>
      <CardPrimaryText small>{`${totalSupply} ${symbol}`}</CardPrimaryText>
    </Card>
  )
}
