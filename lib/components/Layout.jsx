import React from 'react'
import { Slide, ToastContainer } from 'react-toastify'

import { Footer } from 'lib/components/Footer'
import { Meta } from 'lib/components/Meta'
import { Nav } from 'lib/components/Nav'
import { NotificationBanners } from 'lib/components/NotificationBanners'

export const Layout = (props) => {
  const { children } = props

  return (
    <>
      <Meta />

      <NotificationBanners />

      <div
        className='flex flex-col w-full'
        style={{
          minHeight: '100vh'
        }}
      >
        <div className='pool-container flex flex-grow relative z-30 h-full page fadeIn animated'>
          <div className='flex flex-col flex-grow'>
            <div id='top' className='main-nav relative spinner-hidden z-10 pt-2'>
              <Nav />
            </div>
            <div
              className='relative flex justify-center flex-grow h-full z-10 text-white'
              style={{
                flex: 1
              }}
            >
              <div className='px-4 sm:px-8 lg:px-12 my-4 w-100 max-w-screen-sm flex flex-col flex-grow'>
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
