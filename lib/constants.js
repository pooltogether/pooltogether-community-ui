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

// Min decimal for day inputs to allow minutes (0.0001 ≈ 8 seconds)
export const DAYS_STEP = 0.0001

// TODO: Delete this in favor of `current-pool-data`
export const CONTRACT_VERSIONS = {
  1: {
    // 3.1.0
    // '': {
    //   contract: 'CompoundPrizePool',
    //   version: '3.1.0'
    // },
    // '': {
    //   contract: 'StakePrizePool',
    //   version: '3.1.0'
    // },
    // '': {
    //   contract: 'ControlledToken',
    //   version: '3.1.0'
    // },
    // '': {
    //   contract: 'SingleRandomWinner',
    //   version: '3.1.0'
    // },
    // '': {
    //   contract: 'Ticket',
    //   version: '3.1.0'
    // },
    // '': {
    //   contract: 'yVaultPrizePool',
    //   version: '3.1.0'
    // },
    '0x363d3d373d3d3d363d73a26b82d34c2f4b44163ad657f07d596aebde48c55af43d82803e903d91602b57fd5bf3': {
      contract: 'MultipleWinners',
      version: '3.1.0'
    },
    // '': {
    //   contract: 'yVaultPrizePool',
    //   version: '3.1.0'
    // },

    // 3.0.1
    '0x363d3d373d3d3d363d73db342a83322416490f1dd4f1f93dd4cc870136d95af43d82803e903d91602b57fd5bf3': {
      contract: 'CompoundPrizePool',
      version: '3.0.1'
    },
    // '': {
    //   contract: 'StakePrizePool',
    //   version: '3.0.1'
    // },
    '0x363d3d373d3d3d363d73750c321b0cd7fc11acb3913ace0b605eddbb2b5a5af43d82803e903d91602b57fd5bf3': {
      contract: 'ControlledToken',
      version: '3.0.1'
    },
    '0x363d3d373d3d3d363d737194c20df246937be2a21f842bddcc770caf43d35af43d82803e903d91602b57fd5bf3': {
      contract: 'SingleRandomWinner',
      version: '3.0.1'
    }
    // '0x363d3d373d3d3d363d7309576c5af80167fc410eb33f85c74a891832085f5af43d82803e903d91602b57fd5bf3': {
    //   contract: 'Ticket',
    //   version: '3.0.1'
    // }
    // '': {
    //   contract: 'yVaultPrizePool',
    //   version: '3.0.1'
    // },
  },
  4: {
    // 3.1.0
    '0x363d3d373d3d3d363d732a9ad0278f0bcf859edd968d67d1d77e856162705af43d82803e903d91602b57fd5bf3': {
      contract: 'CompoundPrizePool',
      version: '3.1.0'
    },
    '0x363d3d373d3d3d363d73047f811f6b9d2be8c252c5b3645e1dc7fcf9358e5af43d82803e903d91602b57fd5bf3': {
      contract: 'StakePrizePool',
      version: '3.1.0'
    },
    '0x363d3d373d3d3d363d73383a0dab587fc47599cb04ebcafd45e7882ffaac5af43d82803e903d91602b57fd5bf3': {
      contract: 'ControlledToken',
      version: '3.1.0'
    },
    // '': {
    //   contract: 'SingleRandomWinner',
    //   version: '3.1.0'
    // },
    '0x363d3d373d3d3d363d73e40f94baad8b48e27d12854623c77e93c009566e5af43d82803e903d91602b57fd5bf3': {
      contract: 'Ticket',
      version: '3.1.0'
    },
    '': {
      contract: 'yVaultPrizePool',
      version: '3.1.0'
    },
    '0x363d3d373d3d3d363d73751e6c7111c44d78db2d91eafacbcd67015a71225af43d82803e903d91602b57fd5bf3': {
      contract: 'MultipleWinners',
      version: '3.1.0'
    },
    // '': {
    //   contract: 'yVaultPrizePool',
    //   version: '3.1.0'
    // },

    // 3.0.1
    '0x363d3d373d3d3d363d730f5da01b3a7cd04eadb8ee9a93b9781658ff95c25af43d82803e903d91602b57fd5bf3': {
      contract: 'CompoundPrizePool',
      version: '3.0.1'
    },
    '0x363d3d373d3d3d363d7379f7c3529535ff1c3c2f452f7768f2413726d20a5af43d82803e903d91602b57fd5bf3': {
      contract: 'StakePrizePool',
      version: '3.0.1'
    },
    '0x363d3d373d3d3d363d73e5b1733b8df503b31821765030fde4d763d2414c5af43d82803e903d91602b57fd5bf3': {
      contract: 'ControlledToken',
      version: '3.0.1'
    },
    '0x363d3d373d3d3d363d73d65fcbc9e07483713eb75f7edd2eb6366be4e01c5af43d82803e903d91602b57fd5bf3': {
      contract: 'SingleRandomWinner',
      version: '3.0.1'
    },
    '0x363d3d373d3d3d363d739da704df85f88e8b7b494f48ec897df8339e461a5af43d82803e903d91602b57fd5bf3': {
      contract: 'Ticket',
      version: '3.0.1'
    }
    // '': {
    //   contract: 'yVaultPrizePool',
    //   version: '3.0.1'
    // },
  }
}
