import React from 'react'
import FeatherIcon from 'feather-icons-react'
import CopyToClipboard from 'react-copy-to-clipboard'
import classnames from 'classnames'

import { poolToast } from 'lib/utils/poolToast'

export const CopyIcon = (props) => {
  const { text, className } = props

  const handleCopy = () => {
    poolToast.success('Copied to clipboard')
  }

  return (
    <CopyToClipboard text={text} onCopy={handleCopy}>
      <FeatherIcon
        icon='copy'
        className={classnames(
          'em-1 my-auto inline-block trans cursor-pointer hover:opacity-70',
          className
        )}
      />
    </CopyToClipboard>
  )
}
