import React from 'react'

import { Button } from 'lib/components/Button'

export const SweepTimelockedForm = (props) => {
  const {
    handleSubmit,
  } = props

  return <>
    <form
      onSubmit={handleSubmit}
      className=''
    >
      <div
        className='font-bold mb-2 py-2 text-lg sm:text-xl lg:text-2xl'
      >
        Sweep Timelocked Funds:
      </div>
      
      <div
        className='my-5'
      >
        <Button
          color='green'
        >
          Sweep
        </Button>
      </div>
    </form>
  </>
}
