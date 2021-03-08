import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

import { COOKIE_OPTIONS } from 'lib/constants'

const THEME = 'theme'

export const ThemeContext = React.createContext(null)

export function ThemeContextProvider(props) {
  // if (!window) {
  //   return null
  // }

  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    let stored = Cookies.get(THEME)

    const body = document.body
    body.classList.add('theme-dark')

    // if (typeof window !== 'undefined' && window.matchMedia) {
    //   const setThemeAutomatically = (newValue) => {
    //     if (newValue === 'dark') {
    //       body.classList.add('theme-dark')
    //       body.classList.remove('theme-light')

    //       setTheme('dark')
    //     } else if (newValue === 'light') {
    //       body.classList.add('theme-light')
    //       body.classList.remove('theme-dark')

    //       setTheme('light')
    //     }
    //   }

    //   // onLoad
    //   setThemeAutomatically(stored)
    // }
  }, [])

  const toggleTheme = (e) => {
    e.preventDefault()

    const body = document.body

    if (body.classList.contains('theme-dark')) {
      body.classList.remove('theme-dark')
      body.classList.add('theme-light')

      Cookies.set(THEME, 'light', COOKIE_OPTIONS)

      setTheme('light')
    } else {
      body.classList.remove('theme-light')
      body.classList.add('theme-dark')

      Cookies.set(THEME, 'dark', COOKIE_OPTIONS)

      setTheme('dark')
    }
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme
      }}
    >
      {props.children}
    </ThemeContext.Provider>
  )
}
