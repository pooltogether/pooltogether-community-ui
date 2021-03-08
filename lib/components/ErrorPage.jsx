import React from 'react'

export function ErrorPage() {
  return (
    <>
      <div
        className='flex flex-col w-full'
        style={{
          minHeight: '100vh'
        }}
      >
        <div className='content mx-auto' style={{ maxWidth: 700 }}>
          <div className='my-0 text-inverse pt-32 px-6 xs:pt-32 xs:px-20'>
            <h4>An error occurred and the PoolTogether team has been notified.</h4>
            <h6>Please try again soon.</h6>
          </div>
        </div>
      </div>
    </>
  )
}
