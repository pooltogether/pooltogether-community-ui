import React from 'react'
import FeatherIcon from 'feather-icons-react'
import classnames from 'classnames'
import CopyToClipboard from 'react-copy-to-clipboard'

import { shorten } from 'lib/utils/shorten'
import { poolToast } from 'lib/utils/poolToast'

export const CopyableAddress = (props) => {
  const { address, className } = props

  const handleCopy = () => {
    poolToast.success('Copied to clipboard')
  }

  return (
    <CopyToClipboard text={address} onCopy={handleCopy}>
      <div className={classnames('cursor-pointer', className)}>
        <span className='hidden sm:flex'>
          {address}
          <FeatherIcon
            icon='copy'
            className='ml-2 sm:ml-4 w-3 h-3 sm:w-4 sm:h-4 my-auto stroke-current'
          />
        </span>
        <span className='flex sm:hidden'>
          {shorten(address)}
          <FeatherIcon
            icon='copy'
            className='ml-2 sm:ml-4 w-3 h-3 sm:w-4 sm:h-4 my-auto stroke-current'
          />
        </span>
      </div>
    </CopyToClipboard>
  )
}
