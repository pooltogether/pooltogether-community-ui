import { Erc20AwardsControlCard } from 'lib/components/Erc20AwardsControlCard'
import { Erc721AwardsControlCard } from 'lib/components/Erc721AwardsControlCard'
import { FairnessControlsCard } from 'lib/components/FairnessControlsCard.'
import { NumOfWinnersControlCard } from 'lib/components/NumOfWinnersControlCard'
import { RngServiceControlCard } from 'lib/components/RngServiceControlCard'
import React from 'react'

export const AdminUI = (props) => {
  return (
    <>
      <Erc20AwardsControlCard />
      <Erc721AwardsControlCard />
      <RngServiceControlCard />
      <NumOfWinnersControlCard />
      <FairnessControlsCard />
    </>
  )
}
