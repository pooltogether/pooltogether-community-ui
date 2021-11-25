import React from 'react'
import { shorten } from '@pooltogether/utilities'

export function ProfileName (props) {
  const { className, ensName, usersAddress } = props

  const name = ensName?.length > 0 ? ensName : shorten({ hash: usersAddress, short: true })

  return <div className={className}>{name}</div>
}

ProfileName.defaultProps = {
  ensName: '',
  usersAddress: '',
  className: ''
}
