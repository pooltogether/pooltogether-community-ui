import classnames from 'classnames'
import { useAtom } from 'jotai'
import { Card, CardPrimaryText, CardTitle } from 'lib/components/Card'
import { poolChainValuesAtom } from 'lib/hooks/usePoolChainValues'
import { userChainValuesAtom } from 'lib/hooks/useUserChainValues'
import { caclulateOdds } from 'lib/utils/caclulateOdds'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import React from 'react'

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
    <Card className='mr-4 text-center'>
      <CardTitle>My tickets</CardTitle>
      <CardPrimaryText>{`${balance} ${symbol}`}</CardPrimaryText>
    </Card>
  )
}

const OddsCard = () => {
  const [poolChainValues] = useAtom(poolChainValuesAtom)
  const [userChainValues] = useAtom(userChainValuesAtom)

  const formattedOdds = numberWithCommas(
    caclulateOdds(
      userChainValues.usersTicketBalance,
      poolChainValues.ticketTotalSupply,
      poolChainValues.ticketDecimals
    ),
    { precision: 0 }
  )

  return (
    <Card className='mx-4 text-center'>
      <CardTitle>My winning odds</CardTitle>
      <CardPrimaryText>1 in {formattedOdds}</CardPrimaryText>
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
    <Card className='ml-4 text-center'>
      <CardTitle>My wallet balance</CardTitle>
      <CardPrimaryText>{`${balance} ${symbol}`}</CardPrimaryText>
    </Card>
  )
}
