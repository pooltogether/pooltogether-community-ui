import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { GlobalHotKeys } from 'react-hotkeys'
import { useCookieOptions } from '@pooltogether/hooks'

import { HOTKEYS_KEY_MAP } from '../constants'

const THEME = 'theme'

export enum ColorTheme {
  light = 'light',
  dark = 'dark'
}

export const ThemeContext = React.createContext<{
  theme: ColorTheme
  toggleTheme: () => void
}>({
  theme: Cookies.get(THEME) || ColorTheme.dark,
  toggleTheme: () => {}
})

export function ThemeContextProvider(props) {
  const [theme, setTheme] = useState(ColorTheme.dark)
  const cookieOptions = useCookieOptions()

  useEffect(() => {
    let stored = Cookies.get(THEME)

    const body = document.body
    body.classList.add('theme-dark')

    if (typeof window !== 'undefined' && window.matchMedia) {
      const setThemeAutomatically = (newValue) => {
        if (newValue === ColorTheme.dark) {
          body.classList.add('theme-dark')
          body.classList.remove('theme-light')

          setTheme(ColorTheme.dark)
        } else if (newValue === ColorTheme.light) {
          body.classList.add('theme-light')
          body.classList.remove('theme-dark')

          setTheme(ColorTheme.light)
        }
      }

      // onLoad
      setThemeAutomatically(stored)
    }
  }, [])

  const toggleTheme = () => {
    const body = document.body

    if (body.classList.contains('theme-dark')) {
      body.classList.remove('theme-dark')
      body.classList.add('theme-light')

      Cookies.set(THEME, ColorTheme.light, cookieOptions)

      setTheme(ColorTheme.light)
    } else {
      body.classList.remove('theme-light')
      body.classList.add('theme-dark')

      Cookies.set(THEME, ColorTheme.dark, cookieOptions)

      setTheme(ColorTheme.dark)
    }
  }

  const handlers = {
    TOGGLE_THEME: toggleTheme
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme
      }}
    >
      <GlobalHotKeys keyMap={HOTKEYS_KEY_MAP} handlers={handlers} />

      {props.children}
    </ThemeContext.Provider>
  )
}
