import { SECONDS_PER_DAY } from '@pooltogether/current-pool-data'

export const MOCK_POOL = {
  chainId: 1,
  prize: {
    prizePeriodSeconds: Math.random() > 0.5 ? SECONDS_PER_DAY.toString() : false
  },
  tokens: {
    underlyingToken: {
      address: '0x6b175474e89094c44da98b954eedeac495271d0f'
    }
  }
}

export const DEFAULT_INPUT_CLASS_NAME =
  'w-full py-2 px-5 text-inverse trans outline-none focus:outline-none active:outline-none leading-none'
export const DEFAULT_INPUT_LABEL_CLASS_NAME = 'mt-0 mb-1 text-xs'
export const DEFAULT_INPUT_GROUP_CLASS_NAME = 'trans'

export const HOTKEYS_KEY_MAP = {
  TOGGLE_THEME: 'ctrl+shift+t'
}

export const POOL_ADDRESS = '0x0cec1a9154ff802e7934fc916ed7ca50bde6844e'

export const GOVERNANCE_CONTRACT_ADDRESSES = {
  1: {
    GovernorAlpha: '0xB3a87172F555ae2a2AB79Be60B336D2F7D0187f0',
    GovernanceToken: '0x0cEC1A9154Ff802e7934Fc916Ed7Ca50bDE6844e',
    GovernanceReserve: '0xdb8E47BEFe4646fCc62BE61EEE5DF350404c124F'
  },
  4: {
    GovernorAlpha: '0x9B63243CD27102fbEc9FAf67CA1a858dcC16Ee01',
    GovernanceToken: '0xc4E90a8Dc6CaAb329f08ED3C8abc6b197Cf0F40A',
    GovernanceReserve: '0xA5224da01a5A792946E4270a02457EB75412c84c'
  }
}
