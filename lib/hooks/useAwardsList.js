import { useMemo } from 'react'
import { useAtom } from 'jotai'

import { erc20AwardsAtom } from 'lib/hooks/useExternalErc20Awards'
import { poolChainValuesAtom } from 'lib/hooks/usePoolChainValues'
import { calculateEstimatedPoolPrize } from 'lib/utils/calculateEstimatedPoolPrize'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

/**
 * Returns a list of all erc20 awards INCLUDING the yield prize
 */
export const useAwardsList = () => {
  const [poolChainValues] = useAtom(poolChainValuesAtom)
  const [erc20Awards] = useAtom(erc20AwardsAtom)

  const awards = useMemo(() => {
    if (erc20Awards.loading) {
      return []
    }

    let awards = [...erc20Awards.awards]

    if (poolChainValues.sablierStream) {
      awards.unshift(_sablierStreamToken(poolChainValues.sablierStream))
    }

    awards.unshift(_depositToken(poolChainValues))

    return awards
  }, [erc20Awards.loading, erc20Awards, poolChainValues])

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
