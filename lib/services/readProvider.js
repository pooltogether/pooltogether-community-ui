/**
  Retrieves a new provider specific to read.  The reason we separate the read and the writes is that the
  web3 providers on mobile dapps are extremely buggy; it's better to read the network through an INFURA
  JsonRpc endpoint.

  This function will first check to see if there is an injected web3.  If web3 is being injected, then a
  Ethers Web3Provider is instantiated to check the network.  Once the network is determined the Ethers
  getDefaultProvider function is used to create a provider pointing to the same network using an Infura node.
*/
import { ethers } from 'ethers'

const providerCache = {}

export const readProvider = async function (networkName) {
  let provider

  try {
    if (networkName) {
      if (/local/.test(networkName)) {
        provider = new ethers.providers.JsonRpcProvider()
      } else if (/sokol/.test(networkName)) {
        provider = new ethers.providers.JsonRpcProvider('https://sokol.poa.network')
      } else if (/poa/.test(networkName)) {
        provider = new ethers.providers.JsonRpcProvider('https://core.poanetwork.dev')
      } else {
        provider = ethers.getDefaultProvider(networkName === 'mainnet' ? 'homestead' : networkName)
      }

      const net = await provider.getNetwork()

      // If we're running against a known network
      if (net && net.name !== 'unknown') {
        if (!providerCache[net.name]) {
          providerCache[net.name] = new ethers.providers.InfuraProvider(
            net.name,
            process.env.NEXT_JS_INFURA_KEY
          )
        }

        // use a separate Infura-based provider for consistent read api
        provider = providerCache[net.name]
      }
    }
  } catch (e) {
    console.error(e)
  }

  return provider
}
