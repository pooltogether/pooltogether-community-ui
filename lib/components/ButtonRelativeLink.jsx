import React from 'react'
import { useRouter } from 'next/router'
import { omit } from 'lodash'

import { ButtonLink } from 'lib/components/ButtonLink'
import { useNetwork } from 'lib/hooks/useNetwork'
import { usePrizePoolContracts } from 'lib/hooks/usePrizePoolContracts'

export const ButtonRelativeLink = (props) => {
  const router = useRouter()
  const poolAlias = router.query.poolAlias

  const { chainId, name: networkName } = useNetwork()
  const { data: prizePoolContracts } = usePrizePoolContracts()

  let href = `/pools/[networkName]/[prizePoolAddress]${props.link}`
  let as = `/pools/${networkName}/${poolAddresses.prizePool}${props.link}`

  if (poolAlias) {
    href = `/[poolAlias]${props.link}`
    as = `/${poolAlias}${props.link}`
  }

  const newProps = omit(props, ['link'])

  return (
    <ButtonLink {...newProps} href={href} as={as}>
      {props.children}
    </ButtonLink>
  )
}
