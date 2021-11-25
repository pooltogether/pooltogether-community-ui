import { useCallback } from 'react'
import { useOnboard } from '@pooltogether/bnc-onboard-hooks'

import { useUsersAddress } from 'lib/hooks/useUsersAddress'
import { useNetwork } from 'lib/hooks/useNetwork'
import { callTransaction } from 'lib/utils/callTransaction'
import { poolToast } from 'lib/utils/poolToast'

export const useSendTransaction = function () {
  const { provider } = useOnboard()
  const { walletMatchesNetwork } = useNetwork()
  const usersAddress = useUsersAddress()

  const sendTx = useCallback(
    async (setTx, contractAddress, contractAbi, method, txName, params = []) => {
      if (!walletMatchesNetwork) {
        poolToast.error('Your current network does not match the network which this pool lives on.')
        return
      }
      callTransaction(
        setTx,
        provider,
        usersAddress,
        contractAddress,
        contractAbi,
        method,
        txName,
        params
      )
    },
    [walletMatchesNetwork]
  )

  return sendTx
}
