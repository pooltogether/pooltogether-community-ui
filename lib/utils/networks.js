export const NETWORK = Object.freeze({
  'mainnet': 1,
  'homestead': 1,
  'ropsten': 3,
  'rinkeby': 4,
  'kovan': 42,
  'bsc': 56,
  'poa-sokol': 77,
  'poa': 99,
  'xdai': 100,
  'matic': 137,
  'local': 31337,
  'mumbai': 80001
})

// Some data from https://github.com/ethereum-lists/chains
export const NETWORK_DATA = Object.freeze({
  1: {
    chainId: 1,
    name: 'mainnet',
    blockExplorerUrl: 'https://etherscan.io',
    view: 'Mainnet',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }
  },
  3: {
    chainId: 3,
    name: 'ropsten',
    blockExplorerUrl: 'https://ropsten.etherscan.io',
    view: 'Ropsten',
    nativeCurrency: { name: 'Ropsten Ether', symbol: 'ROP', decimals: 18 }
  },
  4: {
    chainId: 4,
    name: 'rinkeby',
    blockExplorerUrl: 'https://rinkeby.etherscan.io',
    view: 'Rinkeby',
    nativeCurrency: { name: 'Rinkeby Ether', symbol: 'RIN', decimals: 18 }
  },
  42: {
    chainId: 42,
    name: 'kovan',
    blockExplorerUrl: 'https://kovan.etherscan.io',
    view: 'Kovan',
    nativeCurrency: { name: 'Kovan Ether', symbol: 'KOV', decimals: 18 }
  },
  56: {
    chainId: 56,
    name: 'bsc',
    blockExplorerUrl: 'https://bscscan.com',
    view: 'Binance Smart Chain',
    nativeCurrency: { name: 'Binance Chain Native Token', symbol: 'BNB', decimals: 18 },
    rpcUrls: [
      'https://bsc-dataseed1.binance.org',
      'https://bsc-dataseed2.binance.org',
      'https://bsc-dataseed3.binance.org',
      'https://bsc-dataseed4.binance.org',
      'https://bsc-dataseed1.defibit.io',
      'https://bsc-dataseed2.defibit.io',
      'https://bsc-dataseed3.defibit.io',
      'https://bsc-dataseed4.defibit.io',
      'https://bsc-dataseed1.ninicoin.io',
      'https://bsc-dataseed2.ninicoin.io',
      'https://bsc-dataseed3.ninicoin.io',
      'https://bsc-dataseed4.ninicoin.io',
      'wss://bsc-ws-node.nariox.org'
    ]
  },
  77: {
    chainId: 77,
    name: 'poa-sokol',
    blockExplorerUrl: 'https://blockscout.com/poa/sokol',
    view: 'Sokol (POA)',
    nativeCurrency: { name: 'POA Sokol Ether', symbol: 'POA', decimals: 18 },
    rpcUrls: [
      'https://sokol.poa.network',
      'wss://sokol.poa.network/wss',
      'ws://sokol.poa.network:8546'
    ]
  },
  97: {
    name: 'Binance Smart Chain Testnet',
    chainId: 97,
    shortName: 'bnbt',
    chain: 'BSC',
    network: 'Chapel',
    networkId: 97,
    blockExplorerUrl: 'https://testnet.bscscan.com',
    nativeCurrency: { name: 'Binance Chain Native Token', symbol: 'tBNB', decimals: 18 },
    view: 'Binance Smart Chain Testnet',
    rpc: [
      'https://data-seed-prebsc-1-s1.binance.org:8545',
      'https://data-seed-prebsc-2-s1.binance.org:8545',
      'https://data-seed-prebsc-1-s2.binance.org:8545',
      'https://data-seed-prebsc-2-s2.binance.org:8545',
      'https://data-seed-prebsc-1-s3.binance.org:8545',
      'https://data-seed-prebsc-2-s3.binance.org:8545'
    ],
    faucets: ['https://testnet.binance.org/faucet-smart'],
    infoURL: 'https://testnet.binance.org/'
  },
  99: {
    chainId: 99,
    name: 'poa',
    blockExplorerUrl: 'https://blockscout.com/poa/core',
    view: 'POA',
    nativeCurrency: { name: 'POA Network Core Ether', symbol: 'SKL', decimals: 18 },
    rpcUrls: [
      'https://core.poanetwork.dev',
      'http://core.poanetwork.dev:8545',
      'https://core.poa.network',
      'ws://core.poanetwork.dev:8546'
    ]
  },
  100: {
    chainId: 100,
    name: 'xdai',
    blockExplorerUrl: 'https://blockscout.com/xdai/mainnet',
    view: 'xDai',
    nativeCurrency: { name: 'xDAI', symbol: 'xDAI', decimals: 18 },
    rpcUrls: [
      'https://rpc.xdaichain.com',
      'https://xdai.poanetwork.dev',
      'wss://rpc.xdaichain.com/wss',
      'wss://xdai.poanetwork.dev/wss',
      'http://xdai.poanetwork.dev',
      'https://dai.poa.network',
      'ws://xdai.poanetwork.dev:8546'
    ]
  },
  137: {
    chainId: 137,
    name: 'matic',
    blockExplorerUrl: 'https://explorer-mainnet.maticvigil.com',
    view: 'Matic',
    nativeCurrency: { name: 'Matic', symbol: 'MATIC', decimals: 18 },
    rpcUrls: ['https://rpc-mainnet.matic.network', 'wss://ws-mainnet.matic.network']
  },
  31337: { chainId: 31337, name: 'local', blockExplorerUrl: 'https://etherscan.io', view: 'Local' },
  80001: {
    chainId: 80001,
    name: 'mumbai',
    blockExplorerUrl: 'https://explorer-mumbai.maticvigil.com',
    view: 'Mumbai (Matic)',
    nativeCurrency: { name: 'Matic', symbol: 'tMATIC', decimals: 18 },
    rpcUrls: ['https://rpc-mumbai.matic.today', 'wss://ws-mumbai.matic.today']
  }
})

export const nameToChainId = (networkName) => {
  if (networkName === 'homestead') return 1
  return Object.values(NETWORK_DATA).find((network) => network.name === networkName)?.chainId
}

export const chainIdToName = (chainId) => {
  return Object.values(NETWORK_DATA).find((network) => network.chainId === chainId)?.name
}

export const chainIdToView = (chainId) => {
  return Object.values(NETWORK_DATA).find((network) => network.chainId === chainId)?.view
}

export const networkColorClassname = (networkId) => {
  if (networkId === 4) {
    return 'text-yellow-1'
  } else if (networkId === 3) {
    return 'text-red-1'
  } else if (networkId === 5) {
    return 'text-blue'
  } else if (networkId === 1234) {
    return 'text-teal'
  } else if (networkId === 42) {
    return 'text-default-soft'
  } else {
    return 'text-white'
  }
}

export const formatBlockExplorerTxUrl = (tx, networkId) => {
  try {
    const blockExplorerUrl = NETWORK_DATA[networkId].blockExplorerUrl
    return `${blockExplorerUrl}/tx/${tx}`
  } catch (e) {
    throw new Error('Chain ID not supported')
  }
}

export const formatBlockExplorerAddressUrl = (address, networkId) => {
  try {
    const blockExplorerUrl = NETWORK_DATA[networkId].blockExplorerUrl
    return `${blockExplorerUrl}/address/${address}`
  } catch (e) {
    throw new Error('Chain ID not supported')
  }
}
