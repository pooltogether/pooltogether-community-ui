import React from 'react'
import classnames from 'classnames'

import { DropdownList } from '../Input/DropdownList'

// TODO: Switch this back to being dynamically generated based on locize
export function LanguagePickerDropdown(props) {
  const langs = {
    en: {
      name: 'English',
      nativeName: 'English'
    },
    es: {
      name: 'Spanish',
      nativeName: 'Español'
    },
    de: {
      name: 'German',
      nativeName: 'Deutsch'
    },
    fr: {
      name: 'French',
      nativeName: 'Français'
    },
    it: {
      name: 'Italian',
      nativeName: 'Italiana'
    },
    ko: {
      name: 'Korean',
      nativeName: '한국어 (韓國語)'
    },
    pt: {
      name: 'Portuguese',
      nativeName: 'Português'
    },
    tr: {
      name: 'Turkish',
      nativeName: 'Türkçe'
    },
    zh: {
      name: 'Zhōngwén',
      nativeName: '中文'
    }
  }

  const { currentLang, changeLang, className } = props

  const formatValue = (key) => {
    const lang = langs[key]

    return (
      <>
        {key.toUpperCase()} - <span className='capitalize'>{lang.nativeName.split(',')[0]}</span> (
        {lang.name.split(';')[0]})
      </>
    )
  }

  return (
    <DropdownList
      id='language-picker-dropdown'
      className={classnames('text-xxs sm:text-sm', className)}
      label={currentLang?.toUpperCase()}
      formatValue={formatValue}
      onValueSet={changeLang}
      current={currentLang}
      values={langs}
    />
  )
}
