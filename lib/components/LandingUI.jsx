import { useAtom } from 'jotai'
import { PrizeCard } from 'lib/components/PrizeCard'
import { poolChainValuesAtom } from 'lib/hooks/usePoolChainValues'
import React from 'react'

export const LandingUI = (props) => {
  return <PrizeCard showLinks />
}
