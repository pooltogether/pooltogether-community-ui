import React from 'react'
import { Slide, ToastContainer } from 'react-toastify'

import { Footer } from 'lib/components/Footer'
import { Meta } from 'lib/components/Meta'
// import { PTHint } from 'lib/components/PTHint'
import { Nav } from 'lib/components/Nav'
import { StaticNetworkNotificationBanner } from 'lib/components/StaticNetworkNotificationBanner'

import packageJson from '../../package.json'

export const Layout = (props) => {
  const { children } = props

  return (
    <>
      <Meta />

      <div
        className='flex flex-col w-full'
        style={{
          minHeight: '100vh'
        }}
      >
        <StaticNetworkNotificationBanner />

        <div className='pool-container flex flex-grow relative z-30 h-full page fadeIn animated'>
          <div className='flex flex-col flex-grow'>
            <div id='top' className='main-nav relative spinner-hidden z-20 pt-2'>
              <Nav />
            </div>
            {/* <PTHint
            title='On fairness fees'
            tip={`To maintain fairness your funds need to contribute interest towards the prize each week. You can:
1) SCHEDULE: receive $1000 DAI once enough interest has been provided to the prize
2) INSTANT: pay $1.90 to withdraw right now and forfeit the interest that would go towards the prize`}
          /> */}

            <div
              className='relative flex flex-col flex-grow h-full z-10 text-white'
              style={{
                flex: 1
              }}
            >
              <div className='px-4 sm:px-8 lg:px-12 my-4'>
                {React.cloneElement(children, {
                  ...props
                })}
              </div>
            </div>

            <div className='main-footer z-10'>
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
  )
}
