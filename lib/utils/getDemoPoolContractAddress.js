import { CONTRACT_ADDRESSES } from 'lib/constants'

export const getDemoPoolContractAddress = (networkName, ticker) => {
  const chainNameToId = {mainnet: 1, ropsten: 3, rinkeby: 4, kovan: 42, buidlerEVM: 31337}
  let chainId = chainNameToId[networkName] || 1
  try {
    return CONTRACT_ADDRESSES[chainId][`${ticker.toUpperCase()}_PRIZE_POOL_CONTRACT_ADDRESS`]
  } catch (e) {
    console.warn('could not get pool address (no chainId?)')
    console.warn(e.message)
  }
}