import React, { useContext, useState } from 'react'
import Link from 'next/link'
import { find, findKey, map, upperFirst } from 'lodash'

import { Button } from 'lib/components/Button'
import { FormPanel } from 'lib/components/FormPanel'
import { RadioInputGroup } from 'lib/components/RadioInputGroup'
import { TextInputGroup } from 'lib/components/TextInputGroup'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { getDemoPoolContractAddress } from 'lib/utils/getDemoPoolContractAddress'
import { shorten } from 'lib/utils/shorten'

import BatSvg from 'assets/images/bat-new-transparent.png'
import DaiSvg from 'assets/images/dai-new-transparent.png'
import UsdcSvg from 'assets/images/usdc-new-transparent.png'
import UsdtSvg from 'assets/images/usdt-new-transparent.png'
import WbtcSvg from 'assets/images/wbtc-new-transparent.png'
import ZrxSvg from 'assets/images/zrx-new-transparent.png'

const demoAssetTypes = {
  dai  : {label: 'DAI',  logo: DaiSvg},
  usdc : {label: 'USDC', logo: UsdcSvg},
  usdt : {label: 'USDT', logo: UsdtSvg},
}
const demoPools = {
  ropsten : {chainId: 3,  assets: ['dai', 'usdc', 'usdt']},
  rinkeby : {chainId: 4,  assets: ['dai', 'usdc', 'usdt']},
  kovan   : {chainId: 42, assets: ['dai', 'usdc', 'usdt']},
}

export const IndexContent = (
  props,
) => {
  const walletContext = useContext(WalletContext)
  const walletNetwork = walletContext._onboard.getState().network

  const [network, setNetwork] = useState('kovan')
  const [contractAddress, setContractAddress] = useState('')

  const demoNetworkName = findKey(demoPools, {chainId: walletNetwork})
  const demoPool = find(demoPools, {chainId: walletNetwork})

  const handleNetworkChange = (e) => {
    setNetwork(e.target.value)
  }

  return <>

      {demoPool && <>
        <div
          className='text-lg sm:text-xl lg:text-2xl mb-4'
        >
          1. View one of the demo pools:
        </div>

        <div
          className='flex flex-col sm:flex-row sm:flex-wrap -mx-4 mb-8 text-xs sm:text-lg lg:text-xl'
        >
          {map(demoPool.assets, assetType => {
            const prizePoolContractAddress = getDemoPoolContractAddress(demoNetworkName, assetType)
            return (
              <Link
                key={`${demoNetworkName}-${assetType}`}
                href='/pools/[networkName]/[prizePoolAddress]'
                as={`/pools/${demoNetworkName}/${prizePoolContractAddress}`}
              >
                <a
                  className='w-full sm:w-1/2 lg:w-1/3 px-4 border-2 border-transparent hover:border-transparent'
                >
                  <div className='flex items-center mb-2 py-2 px-4 inline-block bg-card hover:bg-card-selected trans border-2 border-highlight-3 hover:border-highlight-2 border-dashed rounded-lg '>
                    <img src={demoAssetTypes[assetType].logo} className='inline-block w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 mr-2' />

                    <div>
                      <span className='text-blue text-base'>{upperFirst(demoNetworkName)} {demoAssetTypes[assetType].label} Pool</span>
                      <br/>
                      <span className='text-xxs sm:text-base inline-block -t-1 relative text-accent-3'>{shorten(prizePoolContractAddress)} <span className='uppercase text-accent-3 opacity-50'>TESTNET DEMO</span></span>
                    </div>
                  </div>
                </a>
              </Link>
            )
          })}
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
                label: 'Kovan'
              },
              {
                value: 'ropsten',
                label: 'Ropsten'
              },
              {
                value: 'rinkeby',
                label: 'Rinkeby'
              },
              {
                value: 'mainnet',
                label: 'Mainnet'
              },
              {
                value: 'local',
                label: 'Local'
              }
            ]}
          />


          <TextInputGroup
            id='contractAddress'
            label={<>
              Prize Pool contract address:
            </>}
            required
            onChange={(e) => setContractAddress(e.target.value)}
            value={contractAddress}
          />

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
