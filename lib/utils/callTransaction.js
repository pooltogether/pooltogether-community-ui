import { ethers } from 'ethers'
import { poolToast } from 'lib/utils/poolToast'

const GAS_MULTIPLIER = 1.2

// this could be smart enough to know which ABI to use based on
// the contract address
export const callTransaction = async (
  setTx,
  provider,
  contractAddress,
  contractAbi,
  method,
  txName,
  params = []
) => {
  setTx({
    inWallet: true
  })

  try {
    const signer = provider.getSigner()

    const contract = new ethers.Contract(contractAddress, contractAbi, signer)

    let gasEstimate
    try {
      gasEstimate = await contract.estimateGas[method](...params)
    } catch (e) {
      console.warn(`error while estimating gas: `, e)
    }

    let gasLimit
    if (gasEstimate) {
      gasLimit = parseInt(gasEstimate.toNumber() * GAS_MULTIPLIER, 10)
    }

    const newTx = await contract[method].apply(null, params, gasLimit)

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

    poolToast.success(`"${txName}" transaction successful!`)
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

      poolToast.error(`Error with "${txName}" - See JS Console for details`)
      console.error(e.message)
    }
  }
}
