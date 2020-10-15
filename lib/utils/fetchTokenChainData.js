import { batch, contract } from '@pooltogether/etherplex'

import ERC20Abi from 'ERC20Abi'

import { DEFAULT_TOKEN_PRECISION } from 'lib/constants'
import { readProvider } from 'lib/utils/getReadProvider'

export const fetchTokenChainValues = async (
  provider,
  usersAddress,
  erc20ContractAddress,
) => {
  try {
    const etherplexTokenContract = contract(
      'token',
      ERC20Abi,
      erc20ContractAddress
    )

    const values = await batch(
      provider,
      etherplexTokenContract
        .decimals()
        .name()
        .symbol()
        .balanceOf(usersAddress),
    )
    console.log({values})

    let decimals = values.token.decimals[0]
    decimals = decimals === 0 ? DEFAULT_TOKEN_PRECISION : decimals


    return {
      tokenDecimals: decimals,
      tokenName: values.token.name[0],
      tokenSymbol: values.token.symbol[0],
      tokenBalanceOf: values.token.balanceOf[0],
    }
  } catch (e) {
    console.warn(e.message)
    // console.error(e)
    return {}
  }
}

export const fetchTokenChainData = async (
  networkName,
  usersAddress,
  erc20ContractAddress,
) => {
  const provider = await readProvider(networkName)

  const tokenChainValues = await fetchTokenChainValues(provider, usersAddress, erc20ContractAddress)
  
  return tokenChainValues
}
