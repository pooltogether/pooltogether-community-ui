import { useAtom } from 'jotai'
import { Linkbtns } from 'lib/components/AdminUI'
import { PrizeCard } from 'lib/components/PrizeCard'
import { poolChainValuesAtom } from 'lib/hooks/usePoolChainValues'
import React from 'react'

export const LandingUI = (props) => {
  const [poolChainValues] = useAtom(poolChainValuesAtom)

  console.log('Landing render')

  return <PrizeCard showLinks />
}
