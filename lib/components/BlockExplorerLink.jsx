import FeatherIcon from 'feather-icons-react'
import classnames from 'classnames'
import React from 'react'

import { formatBlockExplorerAddressUrl, formatBlockExplorerTxUrl } from 'lib/utils/networks'
import { shorten as shortenHash } from 'lib/utils/shorten'
import { useNetwork } from 'lib/hooks/useNetwork'
import { CopyIcon } from 'lib/components/CopyIcon'

export const BlockExplorerLink = (props) => {
  const { address, tx, children, className, shorten, iconClassName, copyable } = props
  const { chainId } = useNetwork()

  let url
  if (tx) {
    url = formatBlockExplorerTxUrl(tx, chainId)
  } else if (address) {
    url = formatBlockExplorerAddressUrl(address, chainId)
  }

  const display = tx || address

  return (
    <>
      <a
        href={url}
        className={`trans hover:opacity-70 ${className} inline-flex`}
        target='_blank'
        rel='noopener noreferrer'
        title='View on Block Explorer'
      >
        {children || (
          <div className='flex'>
            <span
              className={classnames('inline-block', {
                'sm:hidden': !shorten
              })}
            >
              {shortenHash(display)}
            </span>
            <span
              className={classnames('hidden', {
                'sm:inline-block': !shorten
              })}
            >
              {display}
            </span>
            <LinkIcon className={iconClassName} />
          </div>
        )}
      </a>
      {copyable && <CopyIcon className='ml-2 my-auto' text={display} />}
    </>
  )
}

export const LinkIcon = (props) => (
  <FeatherIcon
    icon='external-link'
    className={classnames('em-1 ml-1 my-auto inline-block', props.className)}
  />
)
