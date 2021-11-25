import React from 'react'
import { useIsTestnets } from '@pooltogether/hooks'
import { SettingsItem } from './SettingsItem'
import { CheckboxInputGroup } from '../../Input/CheckboxInputGroup'

export const TestnetSettingsItem = (props) => {
  const { t } = props

  return (
    <SettingsItem label={t('developmentMode', 'Development mode')}>
      <Toggle label={t('useTestnets', 'Use testnets')} />
    </SettingsItem>
  )
}

const Toggle = (props) => {
  const { isTestnets, enableTestnets, disableTestnets } = useIsTestnets()

  return (
    <CheckboxInputGroup
      large
      id='testnets-view-toggle'
      name='testnets-view-toggle'
      label={props.label}
      checked={isTestnets}
      handleClick={() => {
        if (isTestnets) {
          disableTestnets()
        } else {
          enableTestnets()
        }
      }}
    />
  )
}
