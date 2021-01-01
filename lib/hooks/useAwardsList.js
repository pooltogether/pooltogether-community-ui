import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'

import { DEFAULT_TOKEN_PRECISION, PRIZE_POOL_TYPE } from 'lib/constants'
import { erc20AwardsAtom } from 'lib/hooks/useExternalErc20Awards'
import { poolChainValuesAtom } from 'lib/hooks/usePoolChainValues'
import { prizePoolTypeAtom } from 'lib/hooks/useDetermineContractVersions'
import { calculateEstimatedPoolPrize } from 'lib/utils/calculateEstimatedPoolPrize'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

/**
 * Returns a list of all erc20 awards INCLUDING the yield prize
 */
export const useAwardsList = () => {
  const [prizeEstimate, setPrizeEstimate] = useState(0)
  const [poolChainValues] = useAtom(poolChainValuesAtom)
  const [erc20Awards] = useAtom(erc20AwardsAtom)
  const [prizePoolType] = useAtom(prizePoolTypeAtom)

  const {
    awardBalance,
    prizePeriodRemainingSeconds,
    poolTotalSupply,
    supplyRatePerBlock
  } = poolChainValues
  const tokenDecimals = poolChainValues.tokenDecimals || DEFAULT_TOKEN_PRECISION
  const tokenSymbol = poolChainValues.tokenSymbol || 'TOKEN'

  useEffect(() => {
    const estimatedPoolPrize = calculateEstimatedPoolPrize({
      tokenDecimals,
      awardBalance,
      poolTotalSupply,
      supplyRatePerBlock,
      prizePeriodRemainingSeconds
    })

    setPrizeEstimate(estimatedPoolPrize)
  }, [poolTotalSupply, supplyRatePerBlock, prizePeriodRemainingSeconds, awardBalance])

  if (erc20Awards.loading) {
    return {
      loading: true,
      awards: []
    }
  }

  let awards = [...erc20Awards.awards]

  if (prizeEstimate && prizeEstimate.gt('0')) {
    const compoundAwardToken = {
      symbol: tokenSymbol,
      formattedBalance: displayAmountInEther(prizeEstimate, {
        precision: 2,
        decimals: tokenDecimals
      }),
      name: poolChainValues.tokenName || ''
    }
    awards.unshift(compoundAwardToken)
  }

  return {
    loading: false,
    awards
  }
}
