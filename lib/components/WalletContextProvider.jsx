// import App from 'next/app'
import React, { useState } from 'react'
import { ethers } from 'ethers'
import Onboard from '@pooltogether/bnc-onboard'
import Cookies from 'js-cookie'

const debug = require('debug')('WalletContextProvider')

const INFURA_KEY = process.env.NEXT_JS_INFURA_KEY
const FORTMATIC_KEY = process.env.NEXT_JS_FORTMATIC_API_KEY
const SELECTED_WALLET_COOKIE_KEY = 'selectedWallet'

const WALLETS_CONFIG = [
  { walletName: "coinbase", preferred: true },
  // { walletName: "trust", preferred: true, rpcUrl: RPC_URL },
  { walletName: "metamask", preferred: true },
  { walletName: "dapper" },
  // {
  //   walletName: 'trezor',
  //   appUrl: APP_URL,
  //   email: CONTACT_EMAIL,
  //   rpcUrl: RPC_URL,
  //   preferred: true
  // },
  // {
  //   walletName: 'ledger',
  //   rpcUrl: RPC_URL,
  //   preferred: true
  // },
  {
    walletName: "fortmatic",
    apiKey: FORTMATIC_KEY,
    preferred: true
  },
  // rpcUrl: process.env.NEXT_JS_FORTMATIC_CUSTOM_NODE_URL,
  {
    walletName: "authereum",
    preferred: true
  },
  {
    walletName: "walletConnect",
    infuraKey: INFURA_KEY,
    preferred: true
  },
  { walletName: "torus" },
  { walletName: "status" },
  { walletName: "unilogin" },
  // { walletName: "imToken", rpcUrl: RPC_URL }
]

export const WalletContext = React.createContext()

let _onboard

const initializeOnboard = (setOnboardState) => {
  _onboard = Onboard({
    dappId: '2cbf96ae-2e31-4b16-bb75-b28c430bb1b1',
    networkId: 42,
    darkMode: true,
    walletSelect: {
      wallets: WALLETS_CONFIG,
    },
    subscriptions: {
      address: async (a) => {
        debug('address change')
        debug(a)
        setOnboardState(previousState => ({
          ...previousState,
          address: a
        }))
      },
      network: async (n) => {
        debug('network change')
        debug(n)
        await _onboard.config({ networkId: n })
        setOnboardState(previousState => ({
          ...previousState,
          network: n
        }))
      },
      wallet: w => {
        debug({w})
        if (!w.name) {
          disconnectWallet(setOnboardState)
        } else {
          connectWallet(w, setOnboardState)

          setAddress(setOnboardState)
        }
      }
    }
  })
}

// walletType is optional here:
const doConnectWallet = async (walletType) => {
  await _onboard.walletSelect(walletType)
  const currentState = _onboard.getState()

  if (currentState.wallet.type) {
    debug("run walletCheck")
    await _onboard.walletCheck()
    debug("walletCheck done")

  }
}

const connectWallet = (w, setOnboardState) => {
  Cookies.set(SELECTED_WALLET_COOKIE_KEY, w.name, { sameSite: 'strict' })

  setOnboardState(previousState => ({
    ...previousState,
    address: undefined,
    wallet: w,
    provider: new ethers.providers.Web3Provider(w.provider)
  }))
}

const disconnectWallet = (setOnboardState) => {
  Cookies.remove(SELECTED_WALLET_COOKIE_KEY)

  setOnboardState(previousState => ({
    ...previousState,
    address: undefined,
    wallet: undefined,
    provider: undefined,
  }))
}

const onPageLoad = async () => {
  const previouslySelectedWallet = Cookies.get(SELECTED_WALLET_COOKIE_KEY)

  if (previouslySelectedWallet !== undefined) {
    debug('using cookie')
    doConnectWallet(previouslySelectedWallet)
  }
}

const setAddress = (setOnboardState) => {
  debug('running setAddress')
  const currentState = _onboard.getState()

  try {
    const provider = currentState.wallet.provider
    debug({ provider})
    debug({ address: provider.selectedAddress })
    const address = provider.selectedAddress
  
    debug('setting address to, ', address)
    // trigger re-render
    setOnboardState(previousState => ({
      ...previousState,
      address
    }))
  } catch (e) {
    console.error(e)
  }
}

export const WalletContextProvider = (props) => {
  const [onboardState, setOnboardState] = useState()

  if (!onboardState) {
    initializeOnboard(setOnboardState)

    onPageLoad(_onboard)
    
    setOnboardState(previousState => ({
      ...previousState,
      onboard: _onboard
    }))
  }

  const handleConnectWallet = () => {
    if (onboardState) {
      doConnectWallet()
    }
  }

  debug('re-render')
  
  return <WalletContext.Provider
    value={{
      handleConnectWallet,
      state: onboardState,
      _onboard
    }}
  >
    {props.children}
  </WalletContext.Provider>
}
