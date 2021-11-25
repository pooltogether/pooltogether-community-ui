import React, { useContext } from 'react'
import classnames from 'classnames'
import { ThemeContext } from '../ThemeContextProvider'

export const LoadingSpinner = (props) => {
  const { theme } = useContext(ThemeContext)
  const { className, displayClassName } = props

  const lightClass = theme === 'dark' && 'white'

  return <span className={classnames(className, displayClassName, `loader01 ${lightClass}`)}></span>
}

LoadingSpinner.defaultProps = {
  displayClassName: 'inline-block'
}
