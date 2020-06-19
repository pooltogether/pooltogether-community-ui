import React, { useContext, useState } from 'react'
import Link from 'next/link'

import { Button } from 'lib/components/Button'
import { FormPanel } from 'lib/components/FormPanel'
import { Input } from 'lib/components/Input'
import { RadioInputGroup } from 'lib/components/RadioInputGroup'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { getDemoPoolContractAddress } from 'lib/utils/getDemoPoolContractAddress'

import DaiSvg from 'assets/images/dai.svg'
import UsdcSvg from 'assets/images/usdc.svg'
import UsdtSvg from 'assets/images/usdt.svg'

export const IndexContent = (
  props,
) => {
  const walletContext = useContext(WalletContext)
  const walletNetwork = walletContext._onboard.getState().network

  const [network, setNetwork] = useState('kovan')
  const [contractAddress, setContractAddress] = useState('')

  const kovanDaiPrizePoolContractAddress = getDemoPoolContractAddress('kovan', 'dai')
  const kovanUsdcPrizePoolContractAddress = getDemoPoolContractAddress('kovan', 'usdc')
  const kovanUsdtPrizePoolContractAddress = getDemoPoolContractAddress('kovan', 'usdt')

  const handleNetworkChange = (e) => {
    setNetwork(e.target.value)
  }

  return <>
    
      {walletNetwork === 42 && <>
        <div
          className='text-lg sm:text-xl lg:text-2xl mb-4'
        >
          1. View one of the demo pools:
        </div>

        <div
          className='text-xs sm:text-lg lg:text-xl'
        >
          <Link
            href='/pools/[networkName]/[prizePoolAddress]'
            as={`/pools/kovan/${kovanDaiPrizePoolContractAddress}`}
          >
            <a
              className='-mx-6 sm:mx-0 lg:-mx-2 w-full lg:w-1/2 px-6 sm:px-4 lg:mr-4 mb-2 py-2 inline-block bg-purple-1100 hover:bg-purple-1000 trans border-2 border-purple-700 rounded-lg hover:border-purple-500'
            >
              <div className='flex items-center'>
                <img src={DaiSvg} className='inline-block w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 mr-2' />

                <div>
                  <span className='text-blue-200 text-base'>Demo Kovan DAI Pool</span>
                  <br/>
                  <span className='text-xxs sm:text-base inline-block -t-1 relative'>{kovanDaiPrizePoolContractAddress}</span>
                </div>
              </div>
            </a>
          </Link>

          <Link
            href='/pools/[networkName]/[prizePoolAddress]'
            as={`/pools/kovan/${kovanUsdcPrizePoolContractAddress}`}
          >
            <a
              className='-mx-6 sm:mx-0 lg:-mx-2 w-full lg:w-1/2 px-6 sm:px-4 lg:mr-4 mb-2 py-2 inline-block bg-purple-1100 hover:bg-purple-1000 trans border-2 border-purple-700 rounded-lg hover:border-purple-500'
            >
              <div className='flex items-center'>
                <img src={UsdcSvg} className='inline-block w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 mr-2' />

                <div>
                  <span className='text-blue-200 text-base'>Demo Kovan USDC Pool</span>
                  <br />
                  <span className='text-xxs sm:text-base inline-block -t-1 relative'>{kovanUsdcPrizePoolContractAddress}</span>
                </div>
              </div>
            </a>
          </Link>

          <Link
            href='/pools/[networkName]/[prizePoolAddress]'
            as={`/pools/kovan/${kovanUsdtPrizePoolContractAddress}`}
          >
            <a
              className='-mx-6 sm:mx-0 lg:-mx-2 w-full lg:w-1/2 px-6 sm:px-4 lg:mr-4 mb-2 py-2 inline-block bg-purple-1100 hover:bg-purple-1000 trans border-2 border-purple-700 rounded-lg hover:border-purple-500'
            >
              <div className='flex items-center'>
                <img src={UsdtSvg} className='inline-block w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 mr-2' />

                <div>
                  <span className='text-blue-200 text-base'>Demo Kovan Tether Pool</span>
                  <br />
                  <span className='text-xxs sm:text-base inline-block -t-1 relative'>{kovanUsdtPrizePoolContractAddress}</span>
                </div>
              </div>
            </a>
          </Link>
        </div>

        <hr/>

        <div
          className='text-lg sm:text-xl lg:text-2xl mb-4'
        >
          2. Or enter a pool to view it's details:
        </div>

      </>}

    <div
      className='-mx-16 sm:-mx-20 lg:-mx-24 px-12'
    >
      <FormPanel>
        <form
          onSubmit={(e) => {
            e.preventDefault()

            window.location.href = `/pools/${network}/${contractAddress}`
          }}
        >
          <RadioInputGroup
            label='Network the Pool is on:'
            name='network'
            onChange={handleNetworkChange}
            value={network}
            radios={[
              {
                value: 'kovan',
                label: 'kovan'
              },
              {
                value: 'ropsten',
                label: 'ropsten'
              },
              {
                value: 'mainnet',
                label: 'mainnet'
              },
              {
                value: 'local',
                label: 'local'
              }
            ]}
          />
          


          <div
            className='fieldset py-2'
          >
            <label
              htmlFor='contractAddress'
              className='text-purple-300 hover:text-white trans mt-0'
            >
              Prize Pool contract address:
            </label>
            <Input
              required
              id='contractAddress'
              onChange={(e) => setContractAddress(e.target.value)}
              value={contractAddress}
            />
          </div>

          <div
            className='my-5'
          >
            <Button
              color='green'
            >
              View Pool
            </Button>
          </div>
        </form>
      </FormPanel>
    </div>
  
  </>
}
