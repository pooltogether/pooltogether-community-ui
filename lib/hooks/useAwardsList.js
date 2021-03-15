import { useEffect, useMemo, useState } from 'react'
import { useAtom } from 'jotai'

import { DEFAULT_TOKEN_PRECISION } from 'lib/constants'
import { erc20AwardsAtom } from 'lib/hooks/useExternalErc20Awards'
import { poolChainValuesAtom } from 'lib/hooks/usePoolChainValues'
import { prizePoolTypeAtom } from 'lib/hooks/useDetermineContractVersions'
import { calculateEstimatedPoolPrize } from 'lib/utils/calculateEstimatedPoolPrize'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

/**
 * Returns a list of all erc20 awards INCLUDING the yield prize
 */
export const useAwardsList = () => {
  const [prizeEstimate, setPrizeEstimate] = useState(0)
  const [poolChainValues] = useAtom(poolChainValuesAtom)
  const [erc20Awards] = useAtom(erc20AwardsAtom)

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

  const awards = useMemo(() => {
    if (erc20Awards.loading) {
      return []
    }

    let awards = [...erc20Awards.awards]

    if (poolChainValues.sablierStream) {
      const formattedBalance = numberWithCommas(poolChainValues.sablierStream.amountUnformatted, {
        decimals: poolChainValues.sablierStream.tokenDecimals
      })

      const streamAwardToken = {
        address: poolChainValues.sablierStream.tokenAddress,
        symbol: poolChainValues.sablierStream.tokenSymbol,
        balance: poolChainValues.sablierStream.amountUnformatted,
        formattedBalance,
        name: poolChainValues.sablierStream.tokenName || '',
        source: 'Sablier Stream'
      }
      awards.unshift(streamAwardToken)
    }

    if (prizeEstimate && prizeEstimate.gt('0')) {
      const formattedBalance = numberWithCommas(prizeEstimate, { decimals: tokenDecimals })

      const compoundAwardToken = {
        address: poolChainValues.tokenAddress,
        symbol: tokenSymbol,
        balance: prizeEstimate,
        formattedBalance,
        name: poolChainValues.tokenName || '',
        source: 'Yield'
      }
      awards.unshift(compoundAwardToken)
    }
    return awards
  }, [erc20Awards, poolChainValues, prizeEstimate])

  if (erc20Awards.loading) {
    return {
      loading: true,
      awards: []
    }
  }

  return {
    loading: false,
    awards
  }
}
