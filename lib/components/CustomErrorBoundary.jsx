import React, { useContext } from 'react'
import Cookies from 'js-cookie'
import * as Sentry from '@sentry/react'

import {
  SELECTED_WALLET_COOKIE_KEY
} from 'lib/constants'
import { poolToast } from 'lib/utils/poolToast'
import { WalletContext } from 'lib/components/WalletContextProvider'

export class ErrorBoundary extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      hasError: false,
      error: undefined,
      errorMessage: undefined
    }
  }

  static getDerivedStateFromError (error) {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch (error, errorInfo) {
    if (error.message) {
      console.error(error.message)
      poolToast.error(error.message)
    }
  }

  render () {
    const { hasError, error } = this.state

    if (hasError) {
      const message = error.message || 'Something went wrong.'
      return <h1 className='text-center mt-8 sm:mt-12'>{message}</h1>
    }

    return this.props.children
  }
}

export function CustomErrorBoundary(props) {
  const { children } = props
  const { onboardWallet } = useContext(WalletContext)

  let walletName = onboardWallet?.name

  if (!walletName) {
    walletName = Cookies.get(SELECTED_WALLET_COOKIE_KEY)
  }

  if (!process.env.NEXT_JS_SENTRY_DSN) {
    return <ErrorBoundary>
      {children}
    </ErrorBoundary>
  } else {
    return <>
      <Sentry.ErrorBoundary
        beforeCapture={(scope) => {
          scope.setTag('web3', walletName)

          scope.setContext('wallet', {
            name: walletName
          })
        }}
        fallback={({ error, componentStack, resetError }) => (
          <ErrorPage />
        )}
      >
        {children}
      </Sentry.ErrorBoundary>
    </>
  }
}