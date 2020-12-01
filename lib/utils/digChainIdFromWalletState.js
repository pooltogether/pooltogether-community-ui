export const digChainIdFromWalletState = (walletContext) => {
  const onboard = walletContext._onboard

  let chainId = 1
  if (onboard) {
    chainId = onboard.getState().appNetworkId
  }

  return chainId
}
