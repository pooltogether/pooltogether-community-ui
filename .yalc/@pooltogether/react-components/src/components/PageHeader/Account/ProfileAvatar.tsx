import React, { useEffect, useRef, useState } from 'react'
import classnames from 'classnames'
import { renderIcon } from '@download/blockies'

const BLOCKIE_DIAMETER = 22

export function ProfileAvatar (props) {
  const { className, usersAddress } = props

  if (!usersAddress) {
    return null
  }

  const image = (
    <div
      className={classnames(
        'profile-img my-auto relative inline-flex justify-center flex-col rounded-full shadow-sm',
        className
      )}
      style={{
        padding: 1,
        height: BLOCKIE_DIAMETER,
        width: BLOCKIE_DIAMETER
      }}
    >
      <BlockieIdenticon
        address={usersAddress}
        alt={`Ethereum address: ${usersAddress}`}
        className='rounded-full'
      />
    </div>
  )

  return image
}

const BlockieIdenticon = ({ address, diameter, alt, className }) => {
  const [dataUrl, setDataUrl] = useState(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    renderIcon({ seed: address.toLowerCase() }, canvas)
    const updatedDataUrl = canvas.toDataURL()

    if (updatedDataUrl !== dataUrl) {
      setDataUrl(updatedDataUrl)
    }
  }, [dataUrl, address])

  return (
    <>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <img className={className} src={dataUrl} height={diameter} width={diameter} alt={alt || ''} />
    </>
  )
}

BlockieIdenticon.defaultProps = {
  address: undefined,
  diameter: BLOCKIE_DIAMETER,
  alt: '',
  className: ''
}
