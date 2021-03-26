import React from 'react'
import { useRouter } from 'next/router'
import { useAtom } from 'jotai'
import { omit } from 'lodash'

import { InternalLink } from 'lib/components/InternalLink'
import { useNetwork } from 'lib/hooks/useNetwork'
import { poolAddressesAtom } from 'lib/hooks/usePoolAddresses'

export const RelativeInternalLink = (props) => {
  const router = useRouter()
  const poolAlias = router.query.poolAlias

  const { chainId, name: networkName } = useNetwork()
  const [poolAddresses] = useAtom(poolAddressesAtom)

  let href = `/pools/[networkName]/[prizePoolAddress]${props.link}`
  let as = `/pools/${networkName}/${poolAddresses.prizePool}${props.link}`

  if (poolAlias) {
    href = `/[poolAlias]${props.link}`
    as = `/${poolAlias}${props.link}`
  }

  const newProps = omit(props, ['link'])

  return (
    <InternalLink {...newProps} href={href} as={as}>
      {props.children}
    </InternalLink>
  )
}
