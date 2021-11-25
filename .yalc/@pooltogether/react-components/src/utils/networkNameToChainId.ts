export function networkNameToChainId(networkName) {
  switch (networkName) {
    case 'ropsten':
      return 3
    case 'rinkeby':
      return 4
    case 'goerli':
      return 5
    case 'kovan':
      return 42
    case 'localhost':
      return 31337
    case 'homestead':
      return 1
    default:
      return 1
  }
}