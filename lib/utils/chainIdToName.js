export function chainIdToName(chainId) {
  switch (chainId) {
    case 1:
      return 'mainnet'
    case 3:
      return 'ropsten'
    case 4:
      return 'rinkeby'
    case 42:
      return 'kovan'
  }
  throw new Error(`unknown network chainId: ${chainId}`)
}