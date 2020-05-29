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
  params = [],
  txDescription,
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


    // console.log(await contract.prizePool());
    // console.log(await contract.getTimelock());
    console.log({ txDescription})
    console.log({method})
    
    const newTx = await contract[method].apply(null, params)

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

    poolToast.success(`"${txDescription}" transaction successful!`)
  } catch (e) {
    console.error(e)
    setTx(tx => ({
      ...tx,
      hash: '',
      inWallet: true,
      sent: true,
      completed: true,
      error: true
    }))

    poolToast.error(`Error with "${txDescription}" transaction. See JS Console`)

    console.error(e.message)
  }
}
