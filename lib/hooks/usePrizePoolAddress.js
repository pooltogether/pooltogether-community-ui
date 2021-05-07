import { useRouter } from 'next/router'

import { POOL_ALIASES } from 'lib/constants'

export const usePrizePoolAddress = () => {
  const router = useRouter()

  const poolAlias = Array.isArray(router.query.poolAlias)
    ? router.query.poolAlias[0]
    : router.query.poolAlias

  let prizePoolAddress
  const aliasMapping = POOL_ALIASES[poolAlias]
  if (poolAlias && aliasMapping) {
    prizePoolAddress = aliasMapping.poolAddress
  } else {
    prizePoolAddress = Array.isArray(router.query.prizePoolAddress)
      ? router.query.prizePoolAddress[0]
      : router.query.prizePoolAddress
  }

  return prizePoolAddress?.toLowerCase()
}
