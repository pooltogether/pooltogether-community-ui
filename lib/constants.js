import PermitAndDepositDaiRinkeby from '@pooltogether/pooltogether-contracts/deployments/rinkeby/PermitAndDepositDai.json'
import PermitAndDepositDaiMainnet from '@pooltogether/pooltogether-contracts/deployments/mainnet/PermitAndDepositDai.json'

import CompoundPrizePoolProxyMainnet from '@pooltogether/pooltogether-contracts/deployments/mainnet/CompoundPrizePoolProxyFactory.json'
import CompoundPrizePoolProxyRinkeby from '@pooltogether/pooltogether-contracts/deployments/rinkeby/CompoundPrizePoolProxyFactory.json'
import CompoundPrizePoolProxyRopsten from '@pooltogether/pooltogether-contracts/deployments/ropsten/CompoundPrizePoolProxyFactory.json'

import StakePrizePoolProxyMainnet from '@pooltogether/pooltogether-contracts/deployments/mainnet/StakePrizePoolProxyFactory.json'
import StakePrizePoolProxyRinkeby from '@pooltogether/pooltogether-contracts/deployments/rinkeby/StakePrizePoolProxyFactory.json'
import StakePrizePoolProxyRopsten from '@pooltogether/pooltogether-contracts/deployments/ropsten/StakePrizePoolProxyFactory.json'

import RNGBlockhashMainnet from '@pooltogether/pooltogether-rng-contracts/deployments/mainnet/RNGBlockhash.json'
import RNGBlockhashRopsten from '@pooltogether/pooltogether-rng-contracts/deployments/ropsten/RNGBlockhash.json'
import RNGBlockhashRinkeby from '@pooltogether/pooltogether-rng-contracts/deployments/rinkeby/RNGBlockhash.json'

import RNGChainlinkMainnet from '@pooltogether/pooltogether-rng-contracts/deployments/mainnet/RNGChainlink.json'
import RNGChainlinkRinkeby from '@pooltogether/pooltogether-rng-contracts/deployments/rinkeby/RNGChainlink.json'

export const SENTINEL_ADDRESS = '0x0000000000000000000000000000000000000001'

export const SUPPORTED_NETWORKS = [1, 3, 4, 42, 31337, 1234]

export const SECONDS_PER_BLOCK = 14

export const DEFAULT_TOKEN_PRECISION = 18

export const DAI_MAINNET_ADDRESS = '0x6b175474e89094c44da98b954eedeac495271d0f'

export const CONTRACT_ADDRESSES = {
  1: {
    PermitAndDepositDai: PermitAndDepositDaiMainnet.address,
    COMPOUND_PRIZE_POOL_PROXY: CompoundPrizePoolProxyMainnet.address,
    STAKE_PRIZE_POOL_PROXY: StakePrizePoolProxyMainnet.address,
    RNG_SERVICE: {
      blockhash: RNGBlockhashMainnet.address,
      chainlink: RNGChainlinkMainnet.address
    }
  },
  3: {
    COMPOUND_PRIZE_POOL_PROXY: CompoundPrizePoolProxyRopsten.address,
    STAKE_PRIZE_POOL_PROXY: StakePrizePoolProxyRopsten.address,
    RNG_SERVICE: {
      blockhash: RNGBlockhashRopsten.address
    }
  },
  4: {
    PermitAndDepositDai: PermitAndDepositDaiRinkeby.address,
    COMPOUND_PRIZE_POOL_PROXY: CompoundPrizePoolProxyRinkeby.address,
    STAKE_PRIZE_POOL_PROXY: StakePrizePoolProxyRinkeby.address,
    RNG_SERVICE: {
      blockhash: RNGBlockhashRinkeby.address,
      chainlink: RNGChainlinkRinkeby.address
    }
  },
  42: {},
  31337: {
    COMPOUND_PRIZE_POOL_PROXY: CompoundPrizePoolProxyRinkeby.address,
    STAKE_PRIZE_POOL_PROXY: StakePrizePoolProxyRinkeby.address,
    RNG_SERVICE: {
      blockhash: '',
      chainlink: ''
    }
  }
}

export const BLOCK_NUMBERS = {
  1: {
    COMPOUND_PRIZE_POOL_PROXY: CompoundPrizePoolProxyMainnet.receipt.blockNumber,
    STAKE_PRIZE_POOL_PROXY: StakePrizePoolProxyMainnet.receipt.blockNumber
  },
  3: {
    COMPOUND_PRIZE_POOL_PROXY: CompoundPrizePoolProxyRopsten.receipt.blockNumber,
    STAKE_PRIZE_POOL_PROXY: StakePrizePoolProxyRopsten.receipt.blockNumber
  },
  4: {
    COMPOUND_PRIZE_POOL_PROXY: CompoundPrizePoolProxyRinkeby.receipt.blockNumber,
    STAKE_PRIZE_POOL_PROXY: StakePrizePoolProxyRinkeby.receipt.blockNumber
  },
  42: {},
  31337: {
    COMPOUND_PRIZE_POOL_PROXY: CompoundPrizePoolProxyRinkeby.receipt.blockNumber,
    STAKE_PRIZE_POOL_PROXY: StakePrizePoolProxyRinkeby.receipt.blockNumber
  }
}

export const PRIZE_POOL_TYPE = Object.freeze({
  compound: 'compound',
  stake: 'stake'
})

export const DATA_REFRESH_POLLING_INTERVAL = 25000
