export function chainIdToName(chainId) {
  switch (chainId) {
    case 1:
      return 'mainnet'
    case 3:
      return 'ropsten'
    case 4:
      return 'rinkeby'
    case 5:
      return 'goerli'
    case 42:
      return 'kovan'
    case 56:
      return 'bsc'
    case 77:
      return 'poa-sokol'
    case 99:
      return 'poa'
    case 100:
      return 'xdai'
    case 137:
      return 'matic'
    case 43114:
      return 'avalanche'
    case 80001:
      return 'mumbai'
    case 1234:
      return 'local'
    case 31337:
      return 'local'
    default:
      return 'unknown network'
  }
  throw new Error(`unknown network chainId: ${chainId}`)
}
