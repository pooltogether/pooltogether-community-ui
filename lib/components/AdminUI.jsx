import { useAtom } from 'jotai'
import { poolChainValuesAtom } from 'lib/hooks/usePoolChainValues'
import { usersAddressAtom } from 'lib/hooks/useUsersAddress'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

export const AdminUI = (props) => {
  const [usersAddress] = useAtom(usersAddressAtom)
  const [poolChainValues] = useAtom(poolChainValuesAtom)

  console.log('Admin render')

  return (
    <div>
      <h1>{usersAddress}</h1>
      <Linkbtns />
    </div>
  )
}

export const Linkbtns = () => {
  const router = useRouter()

  const { networkName, prizePoolAddress } = router.query

  return (
    <div>
      <Link
        href={`/pools/[networkName]/[prizePoolAddress]/`}
        as={`/pools/${networkName}/${prizePoolAddress}/`}
      >
        <a>landing</a>
      </Link>
      <br />
      <Link
        href={`/pools/[networkName]/[prizePoolAddress]/home`}
        as={`/pools/${networkName}/${prizePoolAddress}/home`}
      >
        <a>home</a>
      </Link>
      <br />
      <Link
        href={`/pools/[networkName]/[prizePoolAddress]/admin`}
        as={`/pools/${networkName}/${prizePoolAddress}/admin`}
      >
        <a>admin</a>
      </Link>
    </div>
  )
}
