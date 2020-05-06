export const getEthBalance = async (walletContext, setEthBalance) => {
  const provider = walletContext.state.provider
  const usersAddress = walletContext.state.address
  if (provider && usersAddress) {
    const ethBalance = await provider.getBalance(usersAddress)
    setEthBalance(ethBalance)
  }
}