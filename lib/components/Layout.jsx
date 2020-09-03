import React from 'react'
import { Slide, ToastContainer } from 'react-toastify'

import { Footer } from 'lib/components/Footer'
import { Meta } from 'lib/components/Meta'
import { Nav } from 'lib/components/Nav'
import { StaticNetworkNotificationBanner } from 'lib/components/StaticNetworkNotificationBanner'

import PoolIcon from 'assets/images/holidays.svg'

export const Layout = (props) => {
  const {
    children
  } = props
  return <>
    <Meta />

    
    <div
      className='flex flex-col w-full'
      style={{
        minHeight: '100vh'
      }}
    >
      <StaticNetworkNotificationBanner />

      <div
        className='pool-container flex flex-grow relative z-30 h-full page fadeIn animated'
      >
        <div
          className='flex flex-col flex-grow'
        >
          <div
            id='top'
            className='main-nav relative spinner-hidden z-20 pt-2'
          >
            <Nav />
          </div>


          <div
            className='relative flex flex-col flex-grow h-full z-10 text-white'
            style={{
              flex: 1
            }}
          >
            <div
              className='px-4 sm:px-8 lg:px-12 my-10 lg:w-2/3'
            >
              <div className='flex items-center'>
                <div
                  className='text-blue-400 title text-xl sm:text-3xl'
                >
                  v3.0 - Reference Pool Frontend
                </div>
                <img src={PoolIcon} className='inline-block w-6 h-6 sm:w-10 sm:h-10 ml-2 mb-2 sm:mb-0' />
              </div>

              <a
                href='https://docs.pooltogether.com/contracts/prize-pool'
                className='trans'
              >
                View documentation
              </a>
            </div>
            
            <div
              className='px-4 sm:px-8 lg:px-12 my-4'
            >
              {React.cloneElement(children, {
                ...props,
              })}
            </div>
          </div>

          <div
            className='main-footer z-10'
          >
            <Footer />
          </div>
        </div>

      </div>
    </div>
    
    <ToastContainer
      className='pool-toast'
      position='top-center'
      autoClose={6000}
      transition={Slide}
    />
  </>
}
