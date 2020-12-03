import React from 'react'
import dynamic from 'next/dynamic'

import { Layout } from 'lib/components/Layout'

import 'react-toastify/dist/ReactToastify.css'
import '@reach/tooltip/styles.css'

import 'assets/styles/index.css'
import 'assets/styles/layout.css'
import 'assets/styles/loader.css'
import 'assets/styles/pool.css'
import 'assets/styles/pool-toast.css'
import 'assets/styles/utils.css'
import 'assets/styles/animations.css'
import 'assets/styles/transitions.css'
import 'assets/styles/typography.css'

import 'assets/styles/bnc-onboard--custom.css'
import 'assets/styles/reach--custom.css'

const DynamicWalletContextProvider = dynamic(
  () => import('lib/components/WalletContextProvider').then((mod) => mod.WalletContextProvider),
  { ssr: false }
)

const JotaiProvider = dynamic(() => import('jotai').then((jt) => jt.Provider), { ssr: false })

function MyApp ({ Component, pageProps }) {
  return (
    <DynamicWalletContextProvider>
      <JotaiProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </JotaiProvider>
    </DynamicWalletContextProvider>
  )
}

export default MyApp
