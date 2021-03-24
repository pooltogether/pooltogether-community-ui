export const tokenSupportsAllowance = (chainId, tokenAddress) => {
  // https://docs.matic.network/docs/contribute/bor/core_concepts/#matic-erc20-token
  if (chainId === 137 || chainId === 80001) {
    switch (tokenAddress) {
      case '0x0000000000000000000000000000000000001010':
        return false
      default:
        return true
    }
  }

  return true
}
