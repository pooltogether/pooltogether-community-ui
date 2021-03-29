import React from 'react'

import { Card, CardPrimaryText, CardTitle } from 'lib/components/Card'
import { calculateOdds } from 'lib/utils/calculateOdds'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { usePoolChainValues } from 'lib/hooks/usePoolChainValues'
import { useUserChainValues } from 'lib/hooks/useUserChainValues'

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
  const { data: poolChainValues, isFetched: poolChainValuesIsFetched } = usePoolChainValues()
  const { data: userChainValues, isFetched: userChainValuesIsFetched } = useUserChainValues()

  if (!poolChainValuesIsFetched || !userChainValuesIsFetched) return null

  const symbol = poolChainValues.token.symbol
  const decimals = poolChainValues.ticket.decimals
  const balance = numberWithCommas(userChainValues.usersTicketBalance, { decimals })

  return (
    <Card small className='text-center' marginClasses='mb-4 mr-2'>
      <CardTitle>My deposits</CardTitle>
      <CardPrimaryText small>{`${balance} ${symbol}`}</CardPrimaryText>
    </Card>
  )
}

const OddsCard = () => {
  const { data: poolChainValues, isFetched: poolChainValuesIsFetched } = usePoolChainValues()
  const { data: userChainValues, isFetched: userChainValuesIsFetched } = useUserChainValues()

  if (!poolChainValuesIsFetched || !userChainValuesIsFetched) return null

  const odds = calculateOdds(
    userChainValues.usersTicketBalanceUnformatted,
    poolChainValues.ticket.totalSupplyUnformatted,
    poolChainValues.ticket.decimals,
    poolChainValues.config.numberOfWinners
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
  const { data: poolChainValues, isFetched: poolChainValuesIsFetched } = usePoolChainValues()
  const { data: userChainValues, isFetched: userChainValuesIsFetched } = useUserChainValues()

  if (!poolChainValuesIsFetched || !userChainValuesIsFetched) return null

  const { symbol, decimals } = poolChainValues.token
  const balance = numberWithCommas(userChainValues.usersTokenBalance, { decimals })

  return (
    <Card small className='text-center' marginClasses='mb-4 ml-2'>
      <CardTitle>My wallet balance</CardTitle>
      <CardPrimaryText small>{`${balance} ${symbol}`}</CardPrimaryText>
    </Card>
  )
}

const TotalDepositsCard = () => {
  const { data: poolChainValues, isFetched: poolChainValuesIsFetched } = usePoolChainValues()

  if (!poolChainValuesIsFetched) return null

  const { symbol, decimals } = poolChainValues.token
  const totalSupplyUnformatted = poolChainValues.ticket.totalSupplyUnformatted
  const totalSupply = numberWithCommas(totalSupplyUnformatted, { decimals })

  return (
    <Card small className='text-center' marginClasses='ml-2'>
      <CardTitle>Total deposits</CardTitle>
      <CardPrimaryText small>{`${totalSupply} ${symbol}`}</CardPrimaryText>
    </Card>
  )
}
