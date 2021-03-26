import { useMemo } from 'react'

import { useExternalErc20Awards } from 'lib/hooks/useExternalErc20Awards'
import { usePoolChainValues } from 'lib/hooks/usePoolChainValues'
import { calculateEstimatedPoolPrize } from 'lib/utils/calculateEstimatedPoolPrize'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

/**
 * Returns a list of all erc20 awards INCLUDING the yield prize
 */
export const useAwardsList = () => {
  const { data: poolChainValues } = usePoolChainValues()
  const { data: erc20Awards, isFetched: erc20AwardsIsFetched } = useExternalErc20Awards()

  const awards = useMemo(() => {
    if (erc20AwardsIsFetched) {
      return []
    }

    let awards = [...erc20Awards.awards]

    if (poolChainValues.prize.sablierStream) {
      awards.unshift(_sablierStreamToken(poolChainValues.prize.sablierStream))
    }

    awards.unshift(_depositToken(poolChainValues))

    return awards
  }, [erc20AwardsIsFetched, erc20Awards, poolChainValues])

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

/**
 * Formats Sablier stream to match the other awards
 */
const _sablierStreamToken = (sablierStreamData) => {
  const {
    amountUnformatted,
    tokenDecimals,
    tokenAddress,
    tokenSymbol,
    tokenName
  } = sablierStreamData

  const formattedBalance = numberWithCommas(amountUnformatted, {
    decimals: tokenDecimals
  })

  return {
    address: tokenAddress,
    symbol: tokenSymbol,
    balance: amountUnformatted,
    formattedBalance,
    name: tokenName || '',
    source: 'Sablier Stream'
  }
}

const _depositToken = (poolChainValues) => {
  const {
    tokenSymbol,
    tokenName,
    tokenDecimals,
    awardBalance,
    poolTotalSupply,
    supplyRatePerBlock,
    prizePeriodRemainingSeconds
  } = poolChainValues

  const prizeEstimate = calculateEstimatedPoolPrize({
    tokenDecimals,
    awardBalance,
    poolTotalSupply,
    supplyRatePerBlock,
    prizePeriodRemainingSeconds
  })

  const formattedBalance = numberWithCommas(prizeEstimate, { decimals: tokenDecimals })

  return {
    address: poolChainValues.tokenAddress,
    symbol: tokenSymbol,
    balance: prizeEstimate,
    formattedBalance,
    name: tokenName || '',
    source: 'Yield'
  }
}
