import React from 'react'
import Link from 'next/link'

import { getDefaultPoolContractAddress } from 'lib/utils/getDefaultPoolContractAddress'

export const IndexContent = (
  props,
) => {
  const kovanPoolContractAddress = getDefaultPoolContractAddress('kovan')

  return <>
    <div
      className='text-lg sm:text-xl lg:text-2xl mb-4'
    >
      View one of the default pools:
    </div>

    <div
      className='text-xs sm:text-lg lg:text-xl'
    >
      <Link
        href='/pools/[networkName]/[poolAddress]'
        as={`/pools/kovan/${kovanPoolContractAddress}`}
      >
        <a>
          <span className='text-blue-200 text-base'>  Default Kovan Pool</span>
          <br/>
          {kovanPoolContractAddress}
        </a>
      </Link>
    </div>


    <hr/>

    <div
      className='text-lg sm:text-xl lg:text-2xl mb-4'
    >
      Or enter a pool to view's details:
    </div>

    <form
      handleSubmit={(e) => {
        e.preventDefault()
      }}
    >
      <label htmlFor=''>Pool the network is on:</label>
      radio

      <label htmlFor=''>Pool's contract address:</label>
      <input />

      <button>
        
      </button>
    </form>
  
  </>
}
