import { useContext } from 'react'

import { WalletContext } from 'lib/components/WalletContextProvider'
import { useNetwork } from 'lib/hooks/useNetwork'
import { callTransaction } from 'lib/utils/callTransaction'
import { poolToast } from 'lib/utils/poolToast'

export const useSendTransaction = function () {
  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider
  const { walletMatchesNetwork } = useNetwork()

  if (!walletMatchesNetwork) {
    poolToast.error('Your current network does not match the network which this pool lives on.')
    return
  }

  const sendTx = async (setTx, contractAddress, contractAbi, method, txName, params = []) => {
    callTransaction(setTx, provider, contractAddress, contractAbi, method, txName, params)
  }

  return sendTx
}
