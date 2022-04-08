import React from 'react'
import { useRouter } from 'next/router'
import { omit } from 'lodash'
import { ButtonLink, SquareLink } from '@pooltogether/react-components'

import { useNetwork } from 'lib/hooks/useNetwork'
import { usePrizePoolContracts } from 'lib/hooks/usePrizePoolContracts'
import { getNetworkNameAliasByChainId } from 'lib/utils/networks'
import Link from 'next/link'

export const ButtonRelativeLink = (props) => {
  const router = useRouter()
  const poolAlias = router.query.poolAlias

  const { chainId } = useNetwork()
  const { data: prizePoolContracts } = usePrizePoolContracts()

  const networkName = getNetworkNameAliasByChainId(chainId)

  let href = `/pools/[networkName]/[prizePoolAddress]${props.link}`
  let as = `/pools/${networkName}/${prizePoolContracts.prizePool.address}${props.link}`

  if (poolAlias) {
    href = `/[poolAlias]${props.link}`
    as = `/${poolAlias}${props.link}`
  }

  console.log({ href, as })

  return (
    <Link href={href} as={as}>
      <SquareLink className={props.className}>{props.children}</SquareLink>
    </Link>
  )
}
