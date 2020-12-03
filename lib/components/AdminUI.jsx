import { ActivateBalanceDrip } from 'lib/components/ActivateBalanceDrip'
import { ActivateVolumeDrip } from 'lib/components/ActivateVolumeDrip'
import { ListBalanceDrips } from 'lib/components/ListBalanceDrips'
import { ListVolumeDrips } from 'lib/components/ListVolumeDrips'
import React from 'react'

export const AdminUI = (props) => {
  const { poolChainValues, poolAddresses } = props

  return (
    <>
      <h5 className='mb-4 uppercase'>Prize Strategy</h5>

      <div className='bg-card p-10 rounded-lg mb-6'>
        <h6>External ERC20 token awards:</h6>
        <p>list and add erc20 token awards</p>
      </div>

      {/* 
    addExternalErc20Award(address)
    removeExternalErc20Award(address, prevToken)

    addExternalErc721Award(address, [nftIds])
    removeExternalErc721Award(address, prev721)
    */}
      <div className='bg-card p-10 rounded-lg mb-6'>
        <h6>External ERC721 (NFT) awards:</h6>
        <p>list and add erc721 nft awards</p>
      </div>

      <h5 className='uppercase mt-10 mb-4'>Comptroller</h5>

      <div className='bg-card p-10 rounded-lg mb-6'>
        <h6 className='mb-2'>Balance drips:</h6>
        <ListBalanceDrips poolChainValues={poolChainValues} poolAddresses={poolAddresses} />
        <ActivateBalanceDrip poolAddresses={poolAddresses} />
      </div>

      <div className='bg-card p-10 rounded-lg mb-6'>
        <h6>Volume drips:</h6>
        <ListVolumeDrips poolChainValues={poolChainValues} poolAddresses={poolAddresses} />
        <ActivateVolumeDrip poolAddresses={poolAddresses} />
      </div>
    </>
  )
}
