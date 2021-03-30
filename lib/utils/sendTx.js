import { ethers } from 'ethers'
import { poolToast } from 'lib/utils/poolToast'

// this could be smart enough to know which ABI to use based on
// the contract address
export const sendTx = async (
  walletMatchesNetwork,
  setTx,
  provider,
  contractAddress,
  contractAbi,
  method,
  params = [],
  txDescription
) => {
  if (!walletMatchesNetwork) {
    poolToast.error('Your current network does not match the network which this pool lives on.')
    return
  }

  setTx({
    inWallet: true
  })

  try {
    const signer = provider.getSigner()

    const contract = new ethers.Contract(contractAddress, contractAbi, signer)

    const newTx = await contract[method].apply(null, params)

    setTx((tx) => ({
      ...tx,
      hash: newTx.hash,
      inWallet: false,
      sent: true
    }))

    await newTx.wait()

    setTx((tx) => ({
      ...tx,
      completed: true
    }))

    poolToast.success(`"${txDescription}" transaction successful!`)
  } catch (e) {
    console.error(e)

    if (e?.message?.match('User denied transaction signature')) {
      setTx((tx) => ({
        ...tx,
        // TODO: should be false, false, true. Need to add 'cancelled' states throughout the app.
        completed: true,
        error: true,
        cancelled: true
      }))

      poolToast.warn('Transaction cancelled')
      // You cancelled the transaction
    } else {
      setTx((tx) => ({
        ...tx,
        completed: true,
        error: true
      }))

      poolToast.error(`Error with "${txDescription}" - See JS Console for details`)
      console.error(e.message)
    }
  }
}
