import React from 'react'

import { WalletInfo } from 'lib/components/WalletInfo'

import PoolLogo from 'assets/images/pooltogether-white-wordmark.svg'

export const Nav = (props) => {
  return <>
    <div className='nav-and-footer-container'>
      <nav
        className='sm:px-8 lg:px-0 nav-min-height flex items-center h-full justify-between flex-wrap'
      >
        <div
          className='w-2/5 lg:w-1/5 justify-start h-full flex items-center truncate'
        >
          <a
            href='/'
            title={'Back to home'}
          >
            <img
              alt={`PoolTogether Logo`}
              src={PoolLogo}
              className='mr-auto lg:m-0 w-16 sm:w-16'
            />
          </a>
        </div>

        <div
          className='w-1/5 lg:w-3/5 flex justify-center h-full text-center lg:text-right'
        >
          &nbsp;
        </div>

        <div
          className='w-2/5 lg:w-1/5 flex justify-end h-full items-center text-right'
        >
          <div
            className='mt-0 sm:mt-0 text-xxs sm:text-sm tracking-wide text-right spinner-hidden'
          >
            <WalletInfo
              {...props}
            />
            <Button
              color='green'
              className='button'
              onClick={handleConnect}
            >
              Connect Wallet
            </Button>
          </div>
        </div>
      </nav>
    </div>
  </>
    
}
