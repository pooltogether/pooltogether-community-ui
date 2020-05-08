import React, { useContext } from 'react'
import Link from 'next/link'

import { WalletContext } from 'lib/components/WalletContextProvider'
import { getDefaultPoolContractAddress } from 'lib/utils/getDefaultPoolContractAddress'

export const IndexContent = (
  props,
) => {
  const kovanPoolContractAddress = getDefaultPoolContractAddress('kovan')

  return <>
    TODO: Form to enter pool address or use link to default pool for this network:
    <hr/>
    Kovan:
    <br />
    <Link
      href='/pools/[networkName]/[poolAddress]'
      as={`/pools/kovan/${kovanPoolContractAddress}`}
    >
      <a>
        {kovanPoolContractAddress}
      </a>
    </Link>
  </>
}
