const PermitAndDepositDaiRinkeby = require(`@pooltogether/pooltogether-contracts/deployments/rinkeby/PermitAndDepositDai.json`)
const PermitAndDepositDaiMainnet = require(`@pooltogether/pooltogether-contracts/deployments/mainnet/PermitAndDepositDai.json`)

export const SENTINEL_ADDRESS = '0x0000000000000000000000000000000000000001'

export const SUPPORTED_NETWORKS = [1, 3, 4, 42, 31337, 1234]

export const SECONDS_PER_BLOCK = 14

export const DEFAULT_TOKEN_PRECISION = 18

export const DAI_MAINNET_ADDRESS = '0x6b175474e89094c44da98b954eedeac495271d0f'

export const CONTRACT_ADDRESSES = {
  1: {
    PermitAndDepositDai: PermitAndDepositDaiMainnet.address
  },
  3: {
  },
  4: {
    PermitAndDepositDai: PermitAndDepositDaiRinkeby.address
  },
  42: {
  },
  31337: {
  },
}
