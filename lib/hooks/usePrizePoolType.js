import { useMemo } from 'react'

import { CONTRACTS, PRIZE_POOL_TYPE } from 'lib/constants'
import { usePrizePoolContracts } from 'lib/hooks/usePrizePoolContracts'

export const usePrizePoolType = () => {
  const {
    data: prizePoolContracts,
    isFetched: prizePoolContractsIsFetched
  } = usePrizePoolContracts()
  if (!prizePoolContractsIsFetched) return null
  return determinePrizePoolType(prizePoolContracts?.prizePool?.contract)
}

export const determinePrizePoolType = (contract) => {
  switch (contract) {
    case CONTRACTS.compound: {
      return PRIZE_POOL_TYPE.compound
    }
    case CONTRACTS.stake: {
      return PRIZE_POOL_TYPE.stake
    }
    case CONTRACTS.yield: {
      return PRIZE_POOL_TYPE.yield
    }
  }
  return null
}
