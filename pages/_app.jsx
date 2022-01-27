import React, { useEffect } from 'react'
import { useInitCookieOptions, useInitRpcApiKeys, useInitReducedMotion } from '@pooltogether/hooks'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import { Provider as JotaiProvider } from 'jotai'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useInitializeOnboard } from '@pooltogether/bnc-onboard-hooks'

import { Layout } from 'lib/components/Layout'
import { ThemeContextProvider } from '@pooltogether/react-components'
import { ErrorBoundary, CustomErrorBoundary } from 'lib/components/CustomErrorBoundary'

import 'react-toastify/dist/ReactToastify.css'
import '@reach/menu-button/styles.css'

import 'assets/styles/index.css'
import 'assets/styles/layout.css'

const queryClient = new QueryClient()

if (process.env.NEXT_JS_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_JS_SENTRY_DSN,
    release: process.env.NEXT_JS_RELEASE_VERSION,
    integrations: [new Integrations.BrowserTracing()]
  })
}

function MyApp ({ Component, pageProps }) {
  // ChunkLoadErrors happen when someone has the app loaded, then we deploy a
  // new release, and the user's app points to previous chunks that no longer exist
  useEffect(() => {
    window.addEventListener('error', (e) => {
      console.log(e)
      if (/Loading chunk [\d]+ failed/.test(e.message)) {
        window.location.reload()
      }
    })
  }, [])

  return (
    <ErrorBoundary>
      <JotaiProvider>
        <QueryClientProvider client={queryClient}>
          <InitPoolTogetherHooks>
            <ThemeContextProvider>
              <Layout>
                <CustomErrorBoundary>
                  <Component {...pageProps} />
                </CustomErrorBoundary>
              </Layout>
            </ThemeContextProvider>
          </InitPoolTogetherHooks>
        </QueryClientProvider>
      </JotaiProvider>
    </ErrorBoundary>
  )
}

const InitPoolTogetherHooks = ({ children }) => {
  useInitRpcApiKeys({
    infura: {
      mainnet: process.env.NEXT_JS_INFURA_ID_MAINNET || process.env.NEXT_JS_INFURA_ID,
      polygon: process.env.NEXT_JS_INFURA_ID_POLYGON || process.env.NEXT_JS_INFURA_ID
    },
    quicknode: {
      bsc: process.env.NEXT_JS_QUICKNODE_ID
    }
  })
  useInitReducedMotion(Boolean(process.env.NEXT_JS_REDUCE_MOTION))
  useInitCookieOptions(process.env.NEXT_JS_DOMAIN_NAME)
  useInitializeOnboard({
    infuraId: process.env.NEXT_JS_INFURA_ID,
    fortmaticKey: process.env.NEXT_JS_FORTMATIC_API_KEY,
    portisKey: process.env.NEXT_JS_PORTIS_API_KEY,
    defaultNetworkName: process.env.NEXT_JS_DEFAULT_ETHEREUM_NETWORK_NAME
  })
  return children
}

export default MyApp
