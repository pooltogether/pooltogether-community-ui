import React from 'react'

import { poolToast } from 'lib/utils/poolToast'

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
