import React from 'react'

import { RelativeInternalLink } from 'lib/components/RelativeInternalLink'

export const RelativeNavLinks = (props) => {
  return (
    <div className='flex justify-between w-11/12 sm:w-1/2 mx-auto text-sm sm:text-base'>
      <RelativeInternalLink link='/home'>Prize Pool</RelativeInternalLink>
      <RelativeInternalLink link='/manage#stats'>Pool Details</RelativeInternalLink>
      <RelativeInternalLink link='/manage#admin'>Admin Pool</RelativeInternalLink>
    </div>
  )
}
