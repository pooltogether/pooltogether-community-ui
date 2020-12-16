import React from 'react'
import dynamic from 'next/dynamic'
import { Provider as JotaiProvider } from 'jotai'
import { QueryCache, ReactQueryCacheProvider } from 'react-query'

import { Layout } from 'lib/components/Layout'
import { ThemeContextProvider } from 'lib/components/contextProviders/ThemeContextProvider'
import { ErrorBoundary } from 'lib/components/ErrorBoundary'
import { PoolData } from 'lib/components/PoolData'

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
import 'assets/styles/themes.css'

import 'assets/styles/bnc-onboard--custom.css'
import 'assets/styles/reach--custom.css'

const queryCache = new QueryCache()

const DynamicWalletContextProvider = dynamic(
  () => import('lib/components/WalletContextProvider').then((mod) => mod.WalletContextProvider),
  { ssr: false }
)

function MyApp ({ Component, pageProps }) {
  return (
    <DynamicWalletContextProvider>
      <ReactQueryCacheProvider queryCache={queryCache}>
        <ThemeContextProvider>
          <JotaiProvider>
            <Layout>
              <ErrorBoundary>
                <PoolData>
                  <Component {...pageProps} />
                </PoolData>
              </ErrorBoundary>
            </Layout>
          </JotaiProvider>
        </ThemeContextProvider>
      </ReactQueryCacheProvider>
    </DynamicWalletContextProvider>
  )
}

export default MyApp
