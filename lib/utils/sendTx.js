import { ethers } from 'ethers'
import { poolToast } from 'lib/utils/poolToast'

// this could be smart enough to know which ABI to use based on 
// the contract address
export const sendTx = async (
  setTx,
  provider,
  contractAddress,
  contractAbi,
  method,
  params,
) => {
  setTx(tx => ({
    ...tx,
    inWallet: true
  }))

  try {
    const signer = provider.getSigner()

    const contract = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    )

    const newTx = await contract[method](params)

    setTx(tx => ({
      ...tx,
      hash: newTx.hash,
      sent: true,
    }))

    await newTx.wait()

    setTx(tx => ({
      ...tx,
      completed: true,
    }))

    poolToast.success('Complete award tx complete!')
  } catch (e) {
    setTx(tx => ({
      ...tx,
      hash: '',
      inWallet: true,
      sent: true,
      completed: true,
      error: true
    }))

    poolToast.error(`Error with transaction. See JS Console`)

    console.error(e.message)
  }
}
