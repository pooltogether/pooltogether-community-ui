import {
  prizePoolUsesKnownYieldSource,
  formatYieldSourceName,
  formatYieldSourceImage
} from '../yieldSourceFormatters'
import { PRIZE_POOL_TYPE } from 'lib/constants'

import CompSvg from 'assets/images/comp.svg'

describe('yieldSourceFormatters', () => {
  let chainId, yieldSourceAddress, prizePoolType

  describe('prizePoolUsesKnownYieldSource', () => {
    it('is true for custom rari yield source', () => {
      const chainId = 1
      const yieldSourceAddress = '0x829df2cb6748b9fd619efcd23cc5c351957ecac9'
      const prizePoolType = PRIZE_POOL_TYPE.yield
      const result = prizePoolUsesKnownYieldSource(chainId, yieldSourceAddress, prizePoolType)
      expect(result).toEqual(true)
    })

    it('is true for custom sushi yield source', () => {
      const chainId = 1
      const yieldSourceAddress = '0x9858ac37e385e52da6385d828cfe55a182d8ffa6'
      const prizePoolType = PRIZE_POOL_TYPE.yield
      const result = prizePoolUsesKnownYieldSource(chainId, yieldSourceAddress, prizePoolType)
      expect(result).toEqual(true)
    })
  })

  describe('formatYieldSourceName', () => {
    describe('mainnet', () => {
      beforeEach(() => {
        chainId = 1
        prizePoolType = PRIZE_POOL_TYPE.yield
      })

      it('provides the name for rari', () => {
        yieldSourceAddress = '0x829df2cb6748b9fd619efcd23cc5c351957ecac9'
        const result = formatYieldSourceName(chainId, yieldSourceAddress, prizePoolType)
        expect(result).toEqual('Rari')
      })

      it('provides the name for sushi', () => {
        yieldSourceAddress = '0x9858ac37e385e52da6385d828cfe55a182d8ffa6'
        const result = formatYieldSourceName(chainId, yieldSourceAddress, prizePoolType)
        expect(result).toEqual('Sushi')
      })

      it('provides the name for aave', () => {
        yieldSourceAddress = '0x858415fdb262f17f7a63f6b1f6fed7af8308a1a7'
        const result = formatYieldSourceName(chainId, yieldSourceAddress, prizePoolType)
        expect(result).toEqual('Aave')
      })

      it('provides the name for cream', () => {
        yieldSourceAddress = '0xf8445C529D363cE114148662387eba5E62016e20'
        const result = formatYieldSourceName(chainId, yieldSourceAddress, prizePoolType)
        expect(result).toEqual('CREAM')
      })

      it('provides the name for compound', () => {
        prizePoolType = PRIZE_POOL_TYPE.compound
        const result = formatYieldSourceName(chainId, null, prizePoolType)
        expect(result).toEqual('Compound Finance')
      })

      it('provides the default for Stake type', () => {
        prizePoolType = PRIZE_POOL_TYPE.stake
        const result = formatYieldSourceName(chainId, null, prizePoolType)
        expect(result).toEqual('--')
      })

      it('falls back to "Custom Yield Source"', () => {
        const result = formatYieldSourceName(chainId, '0xface', prizePoolType)
        expect(result).toEqual('Custom Yield Source')
      })
    })

    describe('polygon', () => {
      beforeEach(() => {
        chainId = 137
        prizePoolType = PRIZE_POOL_TYPE.yield
      })

      it('provides the name for aave', () => {
        yieldSourceAddress = '0xEbED994f97396106f7B3d55C287A6A51128cDBB1'
        const result = formatYieldSourceName(chainId, yieldSourceAddress, prizePoolType)
        expect(result).toEqual('Aave')
      })
    })
  })

  describe('formatYieldSourceImage', () => {
    it('gives image path for rari', () => {
      const result = formatYieldSourceImage(PRIZE_POOL_TYPE.yield, 'rari')
      expect(result).toEqual('/custom-yield-source-images/rari.png')
    })

    it('gives image path for aave', () => {
      const result = formatYieldSourceImage(PRIZE_POOL_TYPE.yield, 'aave')
      expect(result).toEqual('/custom-yield-source-images/aave-small.png')
    })

    it('gives image path for cream', () => {
      const result = formatYieldSourceImage(PRIZE_POOL_TYPE.yield, 'cream')
      expect(result).toEqual('/custom-yield-source-images/cream-small.png')
    })

    it('gives image path for sushi', () => {
      const result = formatYieldSourceImage(PRIZE_POOL_TYPE.yield, 'sushi')
      expect(result).toEqual('/custom-yield-source-images/sushi.png')
    })

    it('gives empty string for stake type', () => {
      const result = formatYieldSourceImage(PRIZE_POOL_TYPE.stake)
      expect(result).toEqual('')
    })

    it('gives empty string for stake type', () => {
      const result = formatYieldSourceImage(PRIZE_POOL_TYPE.compound)
      expect(result).toEqual(CompSvg)
    })
  })
})
