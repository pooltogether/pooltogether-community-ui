import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import FeatherIcon from 'feather-icons-react'
import { poolToast } from 'lib/utils/poolToast'

export const SRWPPBResultPanel = (props) => {
  const {
    resultingContractAddresses,
  } = props

  const {
    interestPool,
    prizePool,
    prizeStrategy,
    collateral,
    ticket
  } = resultingContractAddresses

  const handleCopy = () => {
    poolToast.success(`Copied to clipboard!`)

    // setTimeout(() => {
    //   this.setState({ copied: false })
    // }, 5000)
  }

  return <>
    <div
      className='font-bold mb-8 py-2 text-lg sm:text-xl lg:text-2xl'
    >
      Contracts deployed:
    </div>

    <div
      className='relative mb-4 bg-purple-1200 rounded-lg py-3 px-6 lg:w-2/3'
      style={{
        minHeight: 60
      }}
    >
      <span
        className='text-purple-300 block text-xs sm:text-base'
      >Interest Pool contract address: </span>
      <div className='absolute t-0 r-0 pr-3 pt-3'>
        <CopyToClipboard
          text={interestPool}
          onCopy={handleCopy}
        >
          <a
            className='flex flex-col items-center justify-center cursor-pointer stroke-current text-blue-300 hover:text-blue-100 rounded-full bg-lightPurple-900 w-6 h-6 block'
            title='Copy to clipboard'
          >
            <FeatherIcon
              icon='copy'
              className='w-4 h-4'
            />
          </a>
        </CopyToClipboard>
      </div>
      <span
        className='text-white font-mono text-sm sm:text-base'
      >{interestPool}</span>
    </div>
    <div
      className='relative mb-4 bg-purple-1200 rounded-lg py-3 px-6 lg:w-2/3'
      style={{
        minHeight: 60
      }}
    >
      <span
        className='text-purple-300 block text-xs sm:text-base'
      >Prize Pool contract address: </span>
      <div className='absolute t-0 r-0 pr-3 pt-3'>
        <CopyToClipboard
          text={prizePool}
          onCopy={handleCopy}
        >
          <a
            className='flex flex-col items-center justify-center cursor-pointer stroke-current text-blue-300 hover:text-blue-100 rounded-full bg-lightPurple-900 w-6 h-6 block'
            title='Copy to clipboard'
          >
            <FeatherIcon
              icon='copy'
              className='w-4 h-4'
            />
          </a>
        </CopyToClipboard>
      </div>
      <span
        className='text-white font-mono text-sm sm:text-base'
      >{prizePool}</span>
    </div>
    <div
      className='relative mb-4 bg-purple-1200 rounded-lg py-3 px-6 lg:w-2/3'
      style={{
        minHeight: 60
      }}
    >
      <span
        className='text-purple-300 block text-xs sm:text-base'
      >Prize Strategy contract address: </span>
      <div className='absolute t-0 r-0 pr-3 pt-3'>
        <CopyToClipboard
          text={prizeStrategy}
          onCopy={handleCopy}
        >
          <a
            className='flex flex-col items-center justify-center cursor-pointer stroke-current text-blue-300 hover:text-blue-100 rounded-full bg-lightPurple-900 w-6 h-6 block'
            title='Copy to clipboard'
          >
            <FeatherIcon
              icon='copy'
              className='w-4 h-4'
            />
          </a>
        </CopyToClipboard>
      </div>
      <span
        className='text-white font-mono text-sm sm:text-base'
      >{prizeStrategy}</span>
    </div>
    <div
      className='relative mb-4 bg-purple-1200 rounded-lg py-3 px-6 lg:w-2/3'
      style={{
        minHeight: 60
      }}
    >
      <span
        className='text-purple-300 block text-xs sm:text-base'
      >Collateral contract address: </span>
      <div className='absolute t-0 r-0 pr-3 pt-3'>
        <CopyToClipboard
          text={collateral}
          onCopy={handleCopy}
        >
          <a
            className='flex flex-col items-center justify-center cursor-pointer stroke-current text-blue-300 hover:text-blue-100 rounded-full bg-lightPurple-900 w-6 h-6 block'
            title='Copy to clipboard'
          >
            <FeatherIcon
              icon='copy'
              className='w-4 h-4'
            />
          </a>
        </CopyToClipboard>
      </div>
      <span
        className='text-white font-mono text-sm sm:text-base'
      >{collateral}</span>
    </div>
    <div
      className='relative mb-4 bg-purple-1200 rounded-lg py-3 px-6 lg:w-2/3'
      style={{
        minHeight: 60
      }}
    >
      <span
        className='text-purple-300 block text-xs sm:text-base'
      >Ticket contract address: </span>
      <div className='absolute t-0 r-0 pr-3 pt-3'>
        <CopyToClipboard
          text={ticket}
          onCopy={handleCopy}
        >
          <a
            className='flex flex-col items-center justify-center cursor-pointer stroke-current text-blue-300 hover:text-blue-100 rounded-full bg-lightPurple-900 w-6 h-6 block'
            title='Copy to clipboard'
          >
            <FeatherIcon
              icon='copy'
              className='w-4 h-4'
            />
          </a>
        </CopyToClipboard>
      </div>
      <span
        className='text-white font-mono text-sm sm:text-base'
      >{ticket}</span>
    </div>
  </>
}

