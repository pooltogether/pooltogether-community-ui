import React, { useContext, useState } from 'react'
import Link from 'next/link'
import { find, findKey, map, upperFirst } from 'lodash'

import { POOL_ALIASES } from 'lib/constants'
import { Button } from 'lib/components/Button'
import { ButtonLink } from 'lib/components/ButtonLink'
import { Card } from 'lib/components/Card'
import { Collapse } from 'lib/components/Collapse'
import { DropdownInputGroup } from 'lib/components/DropdownInputGroup'
import { TextInputGroup } from 'lib/components/TextInputGroup'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { useCoingeckoTokenData } from 'lib/hooks/useCoingeckoTokenData'
import { getDemoPoolContractAddress } from 'lib/utils/getDemoPoolContractAddress'
import { shorten } from 'lib/utils/shorten'

import BatSvg from 'assets/images/bat-new-transparent.png'
import DaiSvg from 'assets/images/dai-new-transparent.png'
import UsdcSvg from 'assets/images/usdc-new-transparent.png'
import UsdtSvg from 'assets/images/usdt-new-transparent.png'
import WbtcSvg from 'assets/images/wbtc-new-transparent.png'
import ZrxSvg from 'assets/images/zrx-new-transparent.png'

const demoAssetTypes = {
  dai: { label: 'DAI', logo: DaiSvg },
  uni: { label: 'UNI Stake' },
  usdc: { label: 'USDC', logo: UsdcSvg },
  usdt: { label: 'USDT', logo: UsdtSvg }
}
const demoPools = {
  rinkeby: { chainId: 4, assets: ['dai', 'usdc', 'usdt'] }
}

const PoolRow = (props) => {
  const { poolAlias } = props

  const { data: tokenData } = useCoingeckoTokenData(poolAlias.tokenAddress)
  const imageUrl = tokenData?.image?.large

  return (
    <div className='flex w-full pb-2 items-center text-xl'>
      <div className='w-1/3'>
        <Link
          as={`/${poolAlias.alias}`}
          href='/[poolAlias]'
        >
          <a className='flex items-center uppercase'>
            {imageUrl && (
              <img src={imageUrl} className='w-8 h-8 mr-4 my-auto rounded-full' />
            )} {poolAlias.alias}
          </a>
        </Link>
      </div>
      <div className='w-1/3'>
        <Link
          as={`/${poolAlias.alias}`}
          href='/[poolAlias]'
        >
          <a>
            Staking
          </a>
        </Link>
      </div>
      <div className='w-1/3 text-right'>
        <ButtonLink
          size='base'
          color='secondary'
          as={`/${poolAlias.alias}`}
          href='/[poolAlias]'
        >
          Deposit
        </ButtonLink>
      </div>
    </div>
  )
}

export const IndexContent = (props) => {
  const walletContext = useContext(WalletContext)
  const walletNetwork = walletContext._onboard.getState().network

  const [network, setNetwork] = useState('mainnet')
  const [contractAddress, setContractAddress] = useState('')

  const demoNetworkName = findKey(demoPools, { chainId: walletNetwork })
  const demoPool = find(demoPools, { chainId: walletNetwork })

  let networkDemoPools = []

  const formatValue = (key) => networks[key].view

  const onValueSet = (network) => {
    setNetwork(network)
  }

  const networks = {
    ropsten: {
      value: 'ropsten',
      view: 'Ropsten'
    },
    rinkeby: {
      value: 'rinkeby',
      view: 'Rinkeby'
    },
    mainnet: {
      value: 'mainnet',
      view: 'Mainnet'
    },
    ['poa-sokol']: {
      value: 'poa-sokol',
      view: 'Sokol (POA)'
    },
    local: {
      value: 'local',
      view: 'Local'
    }
  }

  demoPool?.assets.forEach((assetType) => {
    const address = getDemoPoolContractAddress(demoNetworkName, assetType)
    if (address) {
      networkDemoPools.push({
        assetType,
        address: getDemoPoolContractAddress(demoNetworkName, assetType)
      })
    }
  })

  return (
    <>
      <div className='flex mt-10 mb-6 sm:mb-10 lg:justify-between'>
        <div className='flex-grow'>
          <h1 className='text-accent-1 title text-xl sm:text-6xl'>Community Prize Pools</h1>

          <h3 className='text-accent-1 mt-2 xs:mt-6 mb-4 text-base sm:text-3xl'>Pool List</h3>

          <Card>
            <div className='flex w-full pt-2 pb-2'>
              <span className='text-accent-1 text-xs w-1/3'>Deposit token</span>
              <span className='text-accent-1 text-xs w-1/3'>Type</span>
            </div>

            <PoolRow
              poolAlias={POOL_ALIASES.bond}
            />
            <PoolRow
              poolAlias={POOL_ALIASES.rai}
            />
          </Card>
        </div>
      </div>

      <div className='w-full lg:mx-auto'>
        {demoPool && (
          <>
            <h3 className='text-accent-1 mt-2 xs:mt-6 mb-4 text-base sm:text-3xl'>Demo Pools</h3>

            <div className='flex justify-center flex-col sm:flex-row sm:flex-wrap -mx-4 mb-8 text-xs sm:text-lg lg:text-xl'>
              {networkDemoPools?.length === 0 ? (
                <>
                  <div className='text-center text-caption uppercase text-sm font-bold text-default rounded-lg bg-default p-4'>
                    No demo pools deployed to this network yet...
                  </div>
                </>
              ) : (
                <>
                  {map(networkDemoPools, (pool) => {
                    return (
                      <Link
                        key={`${demoNetworkName}-${pool.assetType}`}
                        href='/pools/[networkName]/[prizePoolAddress]'
                        as={`/pools/${demoNetworkName}/${pool.address}`}
                      >
                        <a className='w-full sm:w-1/2 lg:w-1/3 px-4 border-2 border-transparent hover:border-transparent'>
                          <div className='flex items-center mb-2 py-2 px-4 inline-block bg-card hover:bg-card-selected trans border-2 border-highlight-3 hover:border-highlight-2 border-dashed rounded-lg '>
                            {demoAssetTypes[pool.assetType]?.logo && (
                              <img
                                src={demoAssetTypes[pool.assetType]?.logo}
                                className='inline-block w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 mr-2'
                              />
                            )}

                            <div>
                              <span className='text-blue text-base'>
                                {upperFirst(demoNetworkName)}{' '}
                                {demoAssetTypes[pool.assetType]?.label} Pool
                              </span>
                              <br />
                              <span className='text-xxs sm:text-base inline-block -t-1 relative text-accent-3'>
                                {shorten(pool.address)}{' '}
                                <span className='uppercase text-accent-3 opacity-50'>
                                  TESTNET DEMO
                                </span>
                              </span>
                            </div>
                          </div>
                        </a>
                      </Link>
                    )
                  })}
                </>
              )}
            </div>
          </>
        )}

        <Card>
          <Collapse title='Lookup pool by contract address'>
            <form
              onSubmit={(e) => {
                e.preventDefault()

                window.location.href = `/pools/${network}/${contractAddress}`
              }}
            >
              <DropdownInputGroup
                id='network-dropdown'
                label={'Network the Pool is on:'}
                formatValue={formatValue}
                onValueSet={onValueSet}
                current={network}
                values={networks}
              />

              <TextInputGroup
                id='contractAddress'
                label={<>Prize Pool contract address:</>}
                required
                onChange={(e) => setContractAddress(e.target.value)}
                value={contractAddress}
              />

              <div className='my-5'>
                <Button color='primary' size='lg'>
                  View Pool
              </Button>
              </div>
            </form>
          </Collapse>
        </Card>
      </div>
    </>
  )
}
