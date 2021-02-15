export function nameToChainId(networkName) {
  switch (networkName) {
    case 'ropsten':
      return 3
    case 'rinkeby':
      return 4
    case 'kovan':
      return 42
    case 'localhost':
      return 31337
    case 'poa-sokol':
      return 77
    case 'poa':
      return 99
    default:
      return 1
  }
}
