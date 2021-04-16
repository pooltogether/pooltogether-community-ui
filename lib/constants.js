import CompoundPrizePoolProxyMainnet from '@pooltogether/pooltogether-contracts/deployments/mainnet/CompoundPrizePoolProxyFactory.json'
import CompoundPrizePoolProxyRinkeby from '@pooltogether/pooltogether-contracts/deployments/rinkeby/CompoundPrizePoolProxyFactory.json'
import CompoundPrizePoolProxyKovan from '@pooltogether/pooltogether-contracts/deployments/kovan/CompoundPrizePoolProxyFactory.json'
import CompoundPrizePoolProxySokol from '@pooltogether/pooltogether-contracts/deployments/poaSokol/CompoundPrizePoolProxyFactory.json'
import CompoundPrizePoolProxyXDai from '@pooltogether/pooltogether-contracts/deployments/xdai/CompoundPrizePoolProxyFactory.json'
import CompoundPrizePoolProxyMatic from '@pooltogether/pooltogether-contracts/deployments/matic/CompoundPrizePoolProxyFactory.json'
import CompoundPrizePoolProxyMumbai from '@pooltogether/pooltogether-contracts/deployments/mumbai/CompoundPrizePoolProxyFactory.json'
import CompoundPrizePoolProxyBsc from '@pooltogether/pooltogether-contracts/deployments/bsc/CompoundPrizePoolProxyFactory.json'
import CompoundPrizePoolProxyBscTestnet from '@pooltogether/pooltogether-contracts/deployments/bscTestnet/CompoundPrizePoolProxyFactory.json'

import StakePrizePoolProxyMainnet from '@pooltogether/pooltogether-contracts/deployments/mainnet/StakePrizePoolProxyFactory.json'
import StakePrizePoolProxyRinkeby from '@pooltogether/pooltogether-contracts/deployments/rinkeby/StakePrizePoolProxyFactory.json'
import StakePrizePoolProxyKovan from '@pooltogether/pooltogether-contracts/deployments/kovan/StakePrizePoolProxyFactory.json'
import StakePrizePoolProxySokol from '@pooltogether/pooltogether-contracts/deployments/poaSokol/StakePrizePoolProxyFactory.json'
import StakePrizePoolProxyXDai from '@pooltogether/pooltogether-contracts/deployments/xdai/StakePrizePoolProxyFactory.json'
import StakePrizePoolProxyMatic from '@pooltogether/pooltogether-contracts/deployments/matic/StakePrizePoolProxyFactory.json'
import StakePrizePoolProxyMumbai from '@pooltogether/pooltogether-contracts/deployments/mumbai/StakePrizePoolProxyFactory.json'
import StakePrizePoolProxyBsc from '@pooltogether/pooltogether-contracts/deployments/bsc/StakePrizePoolProxyFactory.json'
import StakePrizePoolProxyBscTestnet from '@pooltogether/pooltogether-contracts/deployments/bscTestnet/StakePrizePoolProxyFactory.json'

import RNGBlockhashMainnet from '@pooltogether/pooltogether-rng-contracts/deployments/mainnet/RNGBlockhash.json'
import RNGBlockhashRinkeby from '@pooltogether/pooltogether-rng-contracts/deployments/rinkeby/RNGBlockhash.json'
import RNGBlockhashKovan from '@pooltogether/pooltogether-rng-contracts/deployments/kovan/RNGBlockhash.json'
import RNGBlockhashSokol from '@pooltogether/pooltogether-rng-contracts/deployments/poaSokol_77/RNGBlockhash.json'
import RNGBlockhashXDai from '@pooltogether/pooltogether-rng-contracts/deployments/xdai_100/RNGBlockhash.json'
import RNGBlockhashMatic from '@pooltogether/pooltogether-rng-contracts/deployments/matic_137/RNGBlockhash.json'
import RNGBlockhashMumbai from '@pooltogether/pooltogether-rng-contracts/deployments/mumbai_80001/RNGBlockhash.json'
import RNGBlockhashBsc from '@pooltogether/pooltogether-rng-contracts/deployments/bsc_56/RNGBlockhash.json'
import RNGBlockhashBscTestnet from '@pooltogether/pooltogether-rng-contracts/deployments/bscTestnet_97/RNGBlockhash.json'

import RNGChainlinkMainnet from '@pooltogether/pooltogether-rng-contracts/deployments/mainnet/RNGChainlink.json'
import RNGChainlinkRinkeby from '@pooltogether/pooltogether-rng-contracts/deployments/rinkeby/RNGChainlink.json'
import RNGChainlinkKovan from '@pooltogether/pooltogether-rng-contracts/deployments/kovan/RNGChainlink.json'
import RNGChainlinkMumbai from '@pooltogether/pooltogether-rng-contracts/deployments/mumbai_80001/RNGChainlink.json'
// import RNGChainlinkBsc from '@pooltogether/pooltogether-rng-contracts/deployments/bsc_56/RNGChainlink.json'
// import RNGChainlinkBscTestnet from '@pooltogether/pooltogether-rng-contracts/deployments/bscTestnet_97/RNGChainlink.json'

import { contractVersions, prizePoolBuilders } from '@pooltogether/current-pool-data'

export const SENTINEL_ADDRESS = '0x0000000000000000000000000000000000000001'

export const ETHEREUM_NETWORKS = [1, 3, 4, 5, 42]
export const SUPPORTED_NETWORKS = [1, 4, 42, 56, 77, 97, 100, 137, 31337, 80001]
// TODO: Remove once we have versioning package
export const NETWORKS_TO_IGNORE_VERSION_CHECKS = [56, 77, 97, 100, 137, 31337, 80001]
export const NETWORKS_WITHOUT_LOGS = [137, 80001]

export const SECONDS_PER_BLOCK = 14
export const SECONDS_PER_DAY = 86400

export const DEFAULT_TOKEN_PRECISION = 18

export const DAI_MAINNET_ADDRESS = '0x6b175474e89094c44da98b954eedeac495271d0f'

export const POOL_ALIASES = {
  'dpi': {
    alias: 'dpi',
    chainId: 1,
    networkName: 'mainnet',
    poolAddress: '0x9f7905C7BD5ec9E870eD50F0E286f2742c19F5B3',
    tokenAddress: '0x1494ca1f11d487c2bbe4543e90080aeba4ba3c2b'
  },
  'rai': {
    alias: 'rai',
    chainId: 1,
    networkName: 'mainnet',
    poolAddress: '0xF6d6B30D31077dB8590FE1bea7A293e1515f8152',
    tokenAddress: '0x03ab458634910AaD20eF5f1C8ee96F1D6ac54919'
  },
  'basis': {
    alias: 'basis',
    chainId: 1,
    networkName: 'mainnet',
    poolAddress: '0x1Ee6194b0e28C12dF0FD107e5eb883Aa071F8C9a'
  },
  'sushi': {
    alias: 'sushi',
    chainId: 1,
    networkName: 'mainnet',
    poolAddress: '0x258d1ab585593831f2dcc898722fb924fc0e3609'
  },
  'bond': {
    alias: 'bond',
    chainId: 1,
    networkName: 'mainnet',
    poolAddress: '0xea7eaecbff99ce2412e794437325f3bd225ee78f',
    tokenAddress: '0x0391d2021f89dc339f60fff84546ea23e337750f'
  },
  'synthetix': {
    alias: 'synthetix',
    chainId: 1,
    networkName: 'mainnet',
    poolAddress: '0x9BdD57C278794BdceD35f091BB26736a4cF4AAa6'
  },
  'aave': {
    alias: 'aave',
    chainId: 1,
    networkName: 'mainnet',
    poolAddress: '0x22964F820d40F22f59bf4A7F06aa8F27b159E398'
  },
  'rinkeby-test': {
    alias: 'rinkeby-test',
    chainId: 4,
    networkName: 'rinkeby',
    poolAddress: '0x4706856FA8Bb747D50b4EF8547FE51Ab5Edc4Ac2'
  },
  'matic-dai': {
    alias: 'matic-dai',
    chainId: 137,
    networkName: 'matic',
    poolAddress: '0x60764c6be24ddab70d9ae1dbf7436533cc073c21'
  }
}

export const CONTRACT_ADDRESSES = {
  1: {
    COMPOUND_PRIZE_POOL_PROXY: CompoundPrizePoolProxyMainnet.address,
    STAKE_PRIZE_POOL_PROXY: StakePrizePoolProxyMainnet.address,
    RNG_SERVICE: {
      blockhash: RNGBlockhashMainnet.address,
      chainlink: RNGChainlinkMainnet.address
    },
    GovernanceTimelock: '0x42cd8312D2BCe04277dD5161832460e95b24262E',
    Sablier: '0xA4fc358455Febe425536fd1878bE67FfDBDEC59a'
  },
  4: {
    COMPOUND_PRIZE_POOL_PROXY: CompoundPrizePoolProxyRinkeby.address,
    STAKE_PRIZE_POOL_PROXY: StakePrizePoolProxyRinkeby.address,
    RNG_SERVICE: {
      blockhash: RNGBlockhashRinkeby.address,
      chainlink: RNGChainlinkRinkeby.address
    },
    GovernanceTimelock: '0x8Df0AfB54836dc8D0AE795503F837Cff197d3df1',
    Sablier: '0xc04Ad234E01327b24a831e3718DBFcbE245904CC'
  },
  42: {
    COMPOUND_PRIZE_POOL_PROXY: CompoundPrizePoolProxyKovan.address,
    STAKE_PRIZE_POOL_PROXY: StakePrizePoolProxyKovan.address,
    RNG_SERVICE: {
      blockhash: RNGBlockhashKovan.address,
      chainlink: RNGChainlinkKovan.address
    }
  },
  56: {
    COMPOUND_PRIZE_POOL_PROXY: CompoundPrizePoolProxyBsc.address,
    STAKE_PRIZE_POOL_PROXY: StakePrizePoolProxyBsc.address,
    RNG_SERVICE: {
      blockhash: RNGBlockhashBsc.address
    }
  },
  77: {
    COMPOUND_PRIZE_POOL_PROXY: CompoundPrizePoolProxySokol.address,
    STAKE_PRIZE_POOL_PROXY: StakePrizePoolProxySokol.address,
    RNG_SERVICE: {
      blockhash: RNGBlockhashSokol.address
    }
  },
  97: {
    COMPOUND_PRIZE_POOL_PROXY: CompoundPrizePoolProxyBscTestnet.address,
    STAKE_PRIZE_POOL_PROXY: StakePrizePoolProxyBscTestnet.address,
    RNG_SERVICE: {
      blockhash: RNGBlockhashBscTestnet.address
    }
  },
  100: {
    COMPOUND_PRIZE_POOL_PROXY: CompoundPrizePoolProxyXDai.address,
    STAKE_PRIZE_POOL_PROXY: StakePrizePoolProxyXDai.address,
    RNG_SERVICE: {
      blockhash: RNGBlockhashXDai.address
    }
  },
  137: {
    COMPOUND_PRIZE_POOL_PROXY: CompoundPrizePoolProxyMatic.address,
    STAKE_PRIZE_POOL_PROXY: StakePrizePoolProxyMatic.address,
    RNG_SERVICE: {
      blockhash: RNGBlockhashMatic.address
    }
  },
  31337: {
    COMPOUND_PRIZE_POOL_PROXY: CompoundPrizePoolProxyRinkeby.address,
    STAKE_PRIZE_POOL_PROXY: StakePrizePoolProxyRinkeby.address,
    RNG_SERVICE: {
      blockhash: '',
      chainlink: ''
    }
  },
  80001: {
    COMPOUND_PRIZE_POOL_PROXY: CompoundPrizePoolProxyMumbai.address,
    STAKE_PRIZE_POOL_PROXY: StakePrizePoolProxyMumbai.address,
    RNG_SERVICE: {
      blockhash: RNGBlockhashMumbai.address,
      chainlink: RNGChainlinkMumbai.address
    }
  }
}

export const PRIZE_POOL_TYPE = Object.freeze({
  compound: 'compound',
  stake: 'stake',
  yield: 'yield'
})

export const CONTRACTS = Object.freeze({
  compound: 'CompoundPrizePool',
  stake: 'StakePrizePool',
  yield: 'YieldPrizePool',
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

export const QUERY_KEYS = {
  readProvider: 'readProvider',
  fetchUserChainData: 'fetchUserChainData',
  fetchPoolChainData: 'fetchPoolChainData',
  fetchExternalErc20Awards: 'fetchExternalErc20Awards',
  fetchExternalErc721Awards: 'fetchExternalErc721Awards',
  contractVersions: 'contractVersions',
  poolContractAddresses: 'poolContractAddresses',
  coingeckoTokenData: 'coingeckoTokenData',
  useAllCreatedPrizePools: 'useAllCreatedPrizePools',
  useAllCreatedPrizePoolsWithTokens: 'useAllCreatedPrizePoolsWithTokens',
  useAllUserTokenBalances: 'useAllUserTokenBalances'
}

export const PRIZE_POOL_BUILDERS = prizePoolBuilders

export const WALLETS = Object.freeze({
  metamask: 'MetaMask'
})

export const NO_REFETCH_QUERY_OPTIONS = Object.freeze({
  refetchInterval: false,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false
})
