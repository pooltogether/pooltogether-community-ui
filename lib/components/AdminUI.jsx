import React from 'react'

import { ActivateBalanceDrip } from 'lib/components/ActivateBalanceDrip'
import { ListBalanceDrips } from 'lib/components/ListBalanceDrips'

export const AdminUI = (
  props,
) => {
  return <>
    <div className='px-4 py-4 sm:py-6 text-center rounded-lg'>
      Admin
    </div>

    <h4>
      Prize Strategy Functionality:
    </h4>
    <h6>
      External ERC20 token awards:
    </h6>
    list erc20 token awards
    {/* 
    addExternalErc20Award(address)
    removeExternalErc20Award(address, prevToken)

    addExternalErc721Award(address, [nftIds])
    removeExternalErc721Award(address, prev721)
    */}

    <h6>
      External ERC721 (NFT) awards:
    </h6>
    list erc721 nft awards

    <h4>
      Comptroller Functionality:
    </h4>

    <h6>
      Balance drips:
    </h6>
    <ListBalanceDrips />
    <ActivateBalanceDrip />
    
    <h6>
      Volume drips:
    </h6>
    {/* <ListVolumeDrips />
    <ActivateVolumeDrip /> */}
  </>
}
