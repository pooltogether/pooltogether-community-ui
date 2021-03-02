import React, { useContext, useMemo, useState } from 'react'
import Link from 'next/link'
import { find, findKey, map, upperFirst } from 'lodash'

import { CONTRACT_ADDRESSES, POOL_ALIASES } from 'lib/constants'
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
import { useAllCreatedPrizePoolsWithTokens } from 'lib/hooks/useAllCreatedPrizePoolsWithTokens'
import { useAllUserTokenBalances } from 'lib/hooks/useAllUserTokenBalances'
import { RowDataCell, Table } from 'lib/components/Table'
import { LoadingDots } from 'lib/components/LoadingDots'
import { getPrecision, numberWithCommas } from 'lib/utils/numberWithCommas'
import { EtherscanAddressLink } from 'lib/components/EtherscanAddressLink'
import { useNetwork } from 'lib/hooks/useNetwork'
import { ethers } from 'ethers'

const demoAssetTypes = {
  dai: { label: 'DAI', logo: DaiSvg },
  uni: { label: 'UNI Stake' },
  usdc: { label: 'USDC', logo: UsdcSvg },
  usdt: { label: 'USDT', logo: UsdtSvg }
}
const demoPools = {
  rinkeby: { chainId: 4, assets: ['dai', 'usdc', 'usdt'] }
}

const PoolRow2 = (props) => {
  const { poolAlias } = props

  const { data: tokenData } = useCoingeckoTokenData(poolAlias.tokenAddress)
  const imageUrl = tokenData?.image?.large

  return (
    <div className='flex w-full pb-2 items-center text-xl my-2'>
      <div className='w-1/3'>
        <Link as={`/${poolAlias.alias}`} href='/[poolAlias]'>
          <a className='flex items-center uppercase hover:text-green-1 trans trans-fast'>
            {imageUrl && <img src={imageUrl} className='w-8 h-8 mr-4 my-auto rounded-full' />}{' '}
            {poolAlias.alias}
          </a>
        </Link>
      </div>
      <div className='w-1/3'>
        <Link as={`/${poolAlias.alias}`} href='/[poolAlias]'>
          <a className=' hover:text-green-1 trans trans-fast'>Staking</a>
        </Link>
      </div>
      <div className='w-1/3 text-right'>
        <ButtonLink
          size='base'
          color='secondary'
          as={`/${poolAlias.alias}`}
          href='/[poolAlias]'
          paddingClasses='px-10 py-1'
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

  return (
    <>
      <PoolsList />
    </>
  )

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

            <PoolRow poolAlias={POOL_ALIASES.bond} />
            <PoolRow poolAlias={POOL_ALIASES.dpi} />
            <PoolRow poolAlias={POOL_ALIASES.rai} />
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

const PoolsList = () => {
  const {
    data: createdPrizePools,
    isFetched: createdPrizePoolsIsFetched
  } = useAllCreatedPrizePoolsWithTokens()
  const { data: tokenBalances, isFetched: tokenBalancesIsFetched } = useAllUserTokenBalances()
  const walletContext = useContext(WalletContext)
  const usersAddress = walletContext._onboard.getState().address
  const { id: chainId, name: networkName } = useNetwork()

  const [governancePools, userPools, allPools] = useMemo(() => {
    if (!createdPrizePools || !tokenBalances) return [[], [], []]

    const governancePools = []
    const userPools = []
    const allPools = []

    createdPrizePools.forEach((prizePool, index) => {
      const token = tokenBalances[prizePool.token]
      const ticket = tokenBalances[prizePool.ticket]
      const row = (
        <PoolRow
          key={index}
          prizePool={prizePool}
          token={token}
          ticket={ticket}
          isWalletConnected={Boolean(usersAddress)}
        />
      )

      // Add to governance pools if owned by the timelock address
      if (prizePool.prizePoolOwner === CONTRACT_ADDRESSES[chainId].GovernanceTimelock) {
        governancePools.push(row)
      }
      // Add to user pools if user has a balance
      if (Boolean(usersAddress) && Number(ticket.balance) !== 0) {
        userPools.push(row)
      }
      // Add to all pools
      allPools.push(row)
    })

    return [governancePools, userPools, allPools]
  }, [createdPrizePools, tokenBalances])

  if (!createdPrizePoolsIsFetched || !tokenBalancesIsFetched) {
    return <LoadingDots />
  }

  return (
    <>
      <Card className='mt-2 xs:mt-6'>
        <h3 className='text-accent-1 mb-4 text-base sm:text-3xl'>Governance Pools</h3>
        <ListHeaders isWalletConnected={Boolean(usersAddress)} />
        <ul>{governancePools}</ul>
      </Card>

      {userPools.length > 1 && (
        <Card>
          <h3 className='text-accent-1 mt-2 xs:mt-6 mb-4 text-base sm:text-3xl'>My Pools</h3>
          <ListHeaders isWalletConnected={Boolean(usersAddress)} />
          <ul>{userPools}</ul>
        </Card>
      )}
      <Card>
        <h3 className='text-accent-1 mt-2 xs:mt-6 mb-4 text-base sm:text-3xl'>All Pools</h3>
        <ListHeaders isWalletConnected={Boolean(usersAddress)} />
        <ul>{allPools}</ul>
      </Card>
    </>
  )
}

const ListHeaders = (props) => {
  const { isWalletConnected } = props
  return (
    <div className='w-full flex text-accent-1 text-xs'>
      <span className='w-1/4'>Title</span>
      <span className='w-1/6'>Type</span>
      {isWalletConnected && <span className='w-1/6'>Ticket balance</span>}
      <span className='w-1/6'>Total deposits</span>
    </div>
  )
}

const PoolRow = (props) => {
  const { prizePool, token, ticket, isWalletConnected } = props
  const { type } = prizePool

  return (
    <li className='flex flex-row mb-2 last:mb-0 w-full'>
      <PoolTitleCell {...props} />
      <div className='w-1/6'>{type}</div>
      {isWalletConnected && <UsersBalanceCell {...props} />}
      <TvlCell {...props} />
      <Actions {...props} />
    </li>
  )
}

const PoolTitleCell = (props) => {
  const { prizePool, token } = props
  const name = token?.name
  const { token: tokenAddress, prizePoolOwner } = prizePool
  const { data: tokenData } = useCoingeckoTokenData(tokenAddress)
  const imageUrl = tokenData?.image?.large

  return (
    <div className='flex flex-col w-1/4'>
      <div className='flex'>
        {imageUrl && <img src={imageUrl} className='w-8 h-8 mr-4 my-auto rounded-full' />}
        {name}
      </div>
      {/* TODO: Special pill if owned by governance */}
      <span className='text-accent-1 text-xxs'>Owned by: {shorten(prizePoolOwner)}</span>
    </div>
  )
}

const TvlCell = (props) => {
  const { ticket, token } = props
  const amount = ticket.totalSupply.toString()
  return (
    <TokenAmountCell
      // amount={numberWithCommas(amount, { precision: getPrecision(ticket.totalSupply.toNumber()) })}
      amount={numberWithCommas(amount)}
      symbol={token.symbol}
    />
  )
}

const UsersBalanceCell = (props) => {
  const { ticket } = props
  const balance = ticket.balance.toString()
  return (
    <TokenAmountCell
      // amount={numberWithCommas(balance, { precision: getPrecision(ticket.balance.toNumber()) })}
      amount={numberWithCommas(balance)}
      symbol={ticket.symbol}
    />
  )
}

const TokenAmountCell = (props) => {
  const { amount, symbol } = props
  return (
    <span className='w-1/6'>
      {amount}
      <span className='ml-1 text-xs text-accent-1'>{symbol}</span>
    </span>
  )
}

const OwnerAddress = (props) => {
  const { ownerAddress } = props
  return (
    <EtherscanAddressLink size='xxs' address={ownerAddress}>
      {ownerAddress}
    </EtherscanAddressLink>
  )
}

const Actions = (props) => {
  const { id: chainId, name: networkName } = useNetwork()
  const { prizePool, ticket } = props
  const { prizePool: prizePoolAddress } = prizePool

  const showWithdraw = Number(ticket.balance) !== 0

  return (
    <div className='ml-auto'>
      <ButtonLink
        size='base'
        color='secondary'
        as={`/pools/${networkName}/${prizePoolAddress}/home`}
        href='/pools/[networkName]/[prizePoolAddress]/home'
        paddingClasses='px-10 py-1'
        className='ml-auto'
      >
        View Pool
      </ButtonLink>
    </div>
  )

  return (
    <div className='flex flex-col w-1/4 ml-auto'>
      <ButtonLink
        size='base'
        color='secondary'
        as={`/pools/${networkName}/${prizePoolAddress}`}
        href='/pools/[networkName]/[prizePoolAddress]'
        paddingClasses='px-10 py-1'
        className='mx-auto'
      >
        Deposit
      </ButtonLink>
      {showWithdraw && (
        <ButtonLink
          size='base'
          color='text_warning'
          as={`/pools/${networkName}/${prizePoolAddress}`}
          href='/pools/[networkName]/[prizePoolAddress]'
          paddingClasses='px-10 py-1'
          className='my-2 mx-auto'
        >
          Withdraw
        </ButtonLink>
      )}
    </div>
  )
}
