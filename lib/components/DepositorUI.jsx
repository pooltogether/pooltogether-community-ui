import { Linkbtns } from 'lib/components/AdminUI'
import { PrizeCard } from 'lib/components/PrizeCard'
import React from 'react'

export const DepositorUI = (props) => {
  console.log('depositor render')

  return (
    <>
      <h1>Depositor</h1>
      <PrizeCard />
      <Linkbtns />
    </>
  )
}
