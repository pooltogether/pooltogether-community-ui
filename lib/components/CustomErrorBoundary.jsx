import React from 'react'
import { useOnboard } from '@pooltogether/bnc-onboard-hooks'
import * as Sentry from '@sentry/react'

import { poolToast } from 'lib/utils/poolToast'
import { ErrorPage } from 'lib/components/ErrorPage'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: undefined,
      errorMessage: undefined
    }
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error, errorInfo) {
    if (error.message) {
      console.error(error.message)
      poolToast.error(error.message)
    }
  }

  render() {
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
  const { walletName } = useOnboard()

  if (!process.env.NEXT_JS_SENTRY_DSN) {
    return <ErrorBoundary>{children}</ErrorBoundary>
  } else {
    return (
      <>
        <Sentry.ErrorBoundary
          beforeCapture={(scope) => {
            scope.setTag('web3', walletName)

            scope.setContext('wallet', {
              name: walletName
            })
          }}
          fallback={({ error, componentStack, resetError }) => <ErrorPage />}
        >
          {children}
        </Sentry.ErrorBoundary>
      </>
    )
  }
}
