import PermitAndDepositDaiRinkeby from '@pooltogether/pooltogether-contracts/deployments/rinkeby/PermitAndDepositDai.json'
import PermitAndDepositDaiMainnet from '@pooltogether/pooltogether-contracts/deployments/mainnet/PermitAndDepositDai.json'

import CompoundPrizePoolProxyMainnet from '@pooltogether/pooltogether-contracts/deployments/mainnet/CompoundPrizePoolProxyFactory.json'
import CompoundPrizePoolProxyRinkeby from '@pooltogether/pooltogether-contracts/deployments/rinkeby/CompoundPrizePoolProxyFactory.json'
// import CompoundPrizePoolProxyRopsten from '@pooltogether/pooltogether-contracts/deployments/ropsten/CompoundPrizePoolProxyFactory.json'

import StakePrizePoolProxyMainnet from '@pooltogether/pooltogether-contracts/deployments/mainnet/StakePrizePoolProxyFactory.json'
import StakePrizePoolProxyRinkeby from '@pooltogether/pooltogether-contracts/deployments/rinkeby/StakePrizePoolProxyFactory.json'
// import StakePrizePoolProxyRopsten from '@pooltogether/pooltogether-contracts/deployments/ropsten/StakePrizePoolProxyFactory.json'

import RNGBlockhashMainnet from '@pooltogether/pooltogether-rng-contracts/deployments/mainnet/RNGBlockhash.json'
import RNGBlockhashRinkeby from '@pooltogether/pooltogether-rng-contracts/deployments/rinkeby/RNGBlockhash.json'
// import RNGBlockhashRopsten from '@pooltogether/pooltogether-rng-contracts/deployments/ropsten/RNGBlockhash.json'

import RNGChainlinkMainnet from '@pooltogether/pooltogether-rng-contracts/deployments/mainnet/RNGChainlink.json'
import RNGChainlinkRinkeby from '@pooltogether/pooltogether-rng-contracts/deployments/rinkeby/RNGChainlink.json'

import { contractVersions } from '@pooltogether/current-pool-data'

export const SENTINEL_ADDRESS = '0x0000000000000000000000000000000000000001'

export const SUPPORTED_NETWORKS = [1, 3, 4, 42, 31337, 1234]

export const SECONDS_PER_BLOCK = 14

export const DEFAULT_TOKEN_PRECISION = 18

export const DAI_MAINNET_ADDRESS = '0x6b175474e89094c44da98b954eedeac495271d0f'

export const POOL_ALIASES = {
  'basis': {
    networkName: 'mainnet',
    poolAddress: '0x1Ee6194b0e28C12dF0FD107e5eb883Aa071F8C9a'
  },
  'rinkeby-test': {
    networkName: 'rinkeby',
    poolAddress: '0x4706856FA8Bb747D50b4EF8547FE51Ab5Edc4Ac2'
  },
  'sushi': {
    networkName: 'mainnet',
    poolAddress: '0x258d1ab585593831f2dcc898722fb924fc0e3609'
  },
  'bond': {
    networkName: 'mainnet',
    poolAddress: '0xea7eaecbff99ce2412e794437325f3bd225ee78f'
  },
  'synthetix': {
    networkName: 'mainnet',
    poolAddress: '0x9BdD57C278794BdceD35f091BB26736a4cF4AAa6'
  },
  'aave': {
    networkName: 'mainnet',
    poolAddress: '0x22964F820d40F22f59bf4A7F06aa8F27b159E398'
  }
}

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
  // 3: {
  //   COMPOUND_PRIZE_POOL_PROXY: CompoundPrizePoolProxyRopsten.address,
  //   STAKE_PRIZE_POOL_PROXY: StakePrizePoolProxyRopsten.address,
  //   RNG_SERVICE: {
  //     blockhash: RNGBlockhashRopsten.address
  //   }
  // },
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
  // 3: {
  //   COMPOUND_PRIZE_POOL_PROXY: CompoundPrizePoolProxyRopsten.receipt.blockNumber,
  //   STAKE_PRIZE_POOL_PROXY: StakePrizePoolProxyRopsten.receipt.blockNumber
  // },
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

export const CONTRACTS = Object.freeze({
  compound: 'CompoundPrizePool',
  stake: 'StakePrizePool',
  singleRandomWinner: 'SingleRandomWinner',
  multipleWinners: 'MultipleWinners'
})

export const MAX_EXIT_FEE_PERCENTAGE = 10

export const DATA_REFRESH_POLLING_INTERVAL = 25000

export const DEFAULT_INPUT_CLASSES =
  'w-full text-inverse bg-transparent trans outline-none leading-none'
export const DEFAULT_INPUT_LABEL_CLASSES = 'mt-0 mb-1 text-xs sm:text-sm'
export const DEFAULT_INPUT_GROUP_CLASSES = 'trans py-2 px-5 sm:py-4 sm:px-10 bg-body'

const domain = process.env.NEXT_JS_DOMAIN_NAME && `.${process.env.NEXT_JS_DOMAIN_NAME}`
export const COOKIE_OPTIONS = {
  sameSite: 'strict',
  secure: process.env.NEXT_JS_DOMAIN_NAME === 'pooltogether.com',
  domain
}

// Cookie strings
export const SELECTED_WALLET_COOKIE_KEY = 'selectedWallet'

// Min decimal for day inputs to allow minutes (0.0001 ≈ 8 seconds)
export const DAYS_STEP = 0.0001

export const CONTRACT_VERSIONS = contractVersions
