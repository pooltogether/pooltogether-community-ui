import { getYieldSourceName } from '@pooltogether/utilities'

import { PRIZE_POOL_TYPE } from 'lib/constants'

import CompSvg from 'assets/images/comp.svg'

export const DEFAULT_STAKE_SOURCE_NAME = 'N/A - Prize staked by owner'
export const DEFAULT_CUSTOM_YIELD_SOURCE_NAME = 'Custom Yield Source'
export const COMPOUND_FINANCE_SOURCE_NAME = 'Compound Finance'

export const DEFAULT_SOURCE_IMG = '/file-text.svg'

const CUSTOM_YIELD_SOURCE_NAME_OVERRIDES = {
  1: {
    '0x829df2cb6748b9fd619efcd23cc5c351957ecac9': 'rari',
    '0x9858ac37e385e52da6385d828cfe55a182d8ffa6': 'sushi'
  }
}

const CUSTOM_YIELD_SOURCE_IMAGES = {
  aave: '/custom-yield-source-images/aave-small.png',
  cream: '/custom-yield-source-images/cream-small.png',
  rari: '/custom-yield-source-images/rari.png',
  sushi: '/custom-yield-source-images/sushi.png'
}

export const prizePoolUsesKnownYieldSource = (chainId, yieldSourceAddress, prizePoolType) => {
  const sourceName = formatYieldSourceName(chainId, yieldSourceAddress, prizePoolType)
  return sourceName !== DEFAULT_CUSTOM_YIELD_SOURCE_NAME
}

export const formatYieldSourceName = (chainId, yieldSourceAddress, prizePoolType) => {
  let sourceName

  if (prizePoolType === PRIZE_POOL_TYPE.compound) {
    sourceName = COMPOUND_FINANCE_SOURCE_NAME
  } else if (prizePoolType === PRIZE_POOL_TYPE.yield) {
    sourceName = _formatCustomYieldSourceName(chainId, yieldSourceAddress.toLowerCase())
  } else if (prizePoolType === PRIZE_POOL_TYPE.stake) {
    sourceName = DEFAULT_STAKE_SOURCE_NAME
  }

  return sourceName
}

export const formatYieldSourceImage = (sourceName, prizePoolType) => {
  let sourceImage = DEFAULT_SOURCE_IMG

  const customImage = CUSTOM_YIELD_SOURCE_IMAGES[sourceName?.toLowerCase()]

  if (prizePoolType === PRIZE_POOL_TYPE.compound) {
    sourceImage = CompSvg
  } else if (prizePoolType === PRIZE_POOL_TYPE.stake) {
    sourceImage = ''
  } else if (customImage) {
    sourceImage = customImage
  }

  return sourceImage
}

const _formatCustomYieldSourceName = (chainId, yieldSourceAddress) => {
  let sourceName = DEFAULT_CUSTOM_YIELD_SOURCE_NAME

  const customName =
    CUSTOM_YIELD_SOURCE_NAME_OVERRIDES?.[chainId]?.[yieldSourceAddress.toLowerCase()]

  const yieldSourceName = getYieldSourceName(chainId, yieldSourceAddress)

  if (yieldSourceName && sourceName === DEFAULT_CUSTOM_YIELD_SOURCE_NAME) {
    sourceName = yieldSourceName
  } else if (customName) {
    sourceName = customName
  }

  return sourceName
}
