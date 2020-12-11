import { atom, useAtom } from 'jotai'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

import { nameToChainId } from 'lib/utils/nameToChainId'

export const networkAtom = atom({})

export const useNetwork = () => {
  const [network, setNetwork] = useAtom(networkAtom)
  const router = useRouter()
  const networkName = router.query.networkName

  useEffect(() => {
    setNetwork({
      name: networkName,
      id: nameToChainId(networkName)
    })
  }, [networkName])

  return network
}
