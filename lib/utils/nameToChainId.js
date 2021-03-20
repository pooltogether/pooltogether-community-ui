export function nameToChainId(networkName) {
  switch (networkName) {
    case 'ropsten':
      return 3
    case 'rinkeby':
      return 4
    case 'kovan':
      return 42
    case 'bsc':
      return 56
    case 'poa-sokol':
      return 77
    case 'poa':
      return 99
    case 'xdai':
      return 100
    case 'matic':
      return 137
    case 'local':
      return 31337
    case 'avalanche':
      return 43114
    case 'mumbai':
      return 80001
    case 'mainnet':
      return 1
    case 'homestead':
      return 1
  }
}
