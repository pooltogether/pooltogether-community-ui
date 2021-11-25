import React, { useContext } from 'react'
import FeatherIcon from 'feather-icons-react'

import { ThemeContext } from '../../ThemeContextProvider'
import { SettingsItem } from './SettingsItem'

export const ThemeSettingsItem = (props) => {
  const { t } = props
  return (
    <SettingsItem label={t('theme', 'Theme')}>
      <ThemeSwitcher />
    </SettingsItem>
  )
}

const ThemeSwitcher = () => {
  const { toggleTheme } = useContext(ThemeContext)

  return (
    <div onClick={toggleTheme} className='theme-toggler m-0 relative select-none'>
      <div className='toggle'></div>
      <div className='theme-toggler--names relative z-10 flex items-center justify-between'>
        <span className='theme-toggler--light font-bold text-xxs ml-2 sm:ml-3'>
          <FeatherIcon icon='sun' className='relative w-4 h-4 sm:w-4 sm:h-4' strokeWidth='3' />
        </span>
        <span className='theme-toggler--dark font-bold text-xxs mr-2 sm:mr-3'>
          <FeatherIcon icon='moon' className='relative w-4 h-4 sm:w-4 sm:h-4' strokeWidth='3' />
        </span>
      </div>
    </div>
  )
}
