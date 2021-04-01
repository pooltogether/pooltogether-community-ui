import { getChain } from 'evm-chains-extended'

export const NETWORK = Object.freeze({
  'mainnet': 1,
  'homestead': 1,
  'ropsten': 3,
  'rinkeby': 4,
  'kovan': 42,
  'bsc': 56,
  'poa-sokol': 77,
  'bsc-testnet': 97,
  'poa': 99,
  'xdai': 100,
  'matic': 137,
  'polygon': 137,
  'local': 31337,
  'mumbai': 80001
})

// export const NETWORKS = {
//   1: 'mainnet',
//   3: 'ropsten',
//   4: 'rinkeby',
//   42: 'kovan',
//   56: 'bsc',
//   77: 'poa-sokol',
//   97: 'bsc-testnet',
//   100: 'xdai',
//   137: 'matic',
//   1234: 'local',
//   31337: 'local',
//   80001: 'mumbai'
// }

export const getChainIdByAlias = (networkAlias) => {
  return NETWORK[networkAlias]
}

// export const nameToChainId = (networkName) => {
//   if (networkName === 'homestead') return 1
//   return Object.values(NETWORK_DATA).find((network) => network.name === networkName)?.chainId

export const getNetworkNameAliasByChainId = (chainId) => {
  const networkKeys = Object.keys(NETWORK)
  const networkAlias = networkKeys.find((networkKey) => NETWORK[networkKey] === chainId)

  if (typeof networkAlias === 'undefined') {
    throw new Error(`No networkAlias found for chainId: ${chainId}`)
  }

  return networkAlias
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
    const blockExplorerUrl = getChain(networkId).blockExplorerUrls[0]
    return `${blockExplorerUrl}/tx/${tx}`
  } catch (e) {
    throw new Error('Chain ID not supported')
  }
}

export const formatBlockExplorerAddressUrl = (address, networkId) => {
  try {
    const blockExplorerUrl = getChain(networkId).blockExplorerUrls[0]
    return `${blockExplorerUrl}/address/${address}`
  } catch (e) {
    throw new Error('Chain ID not supported')
  }
}
