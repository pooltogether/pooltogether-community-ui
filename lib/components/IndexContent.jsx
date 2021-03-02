import React, { useContext, useMemo, useState } from 'react'
import Link from 'next/link'
import { find, findKey, upperFirst } from 'lodash'
import FeatherIcon from 'feather-icons-react'
import classnames from 'classnames'

import { CONTRACT_ADDRESSES, POOL_ALIASES } from 'lib/constants'
import { ButtonLink } from 'lib/components/ButtonLink'
import { Card } from 'lib/components/Card'
import { Collapse } from 'lib/components/Collapse'
import { DropdownInputGroup } from 'lib/components/DropdownInputGroup'
import { TextInputGroup } from 'lib/components/TextInputGroup'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { useCoingeckoTokenData } from 'lib/hooks/useCoingeckoTokenData'
import { getDemoPoolContractAddress } from 'lib/utils/getDemoPoolContractAddress'
import { shorten } from 'lib/utils/shorten'
import { useAllCreatedPrizePoolsWithTokens } from 'lib/hooks/useAllCreatedPrizePoolsWithTokens'
import { useAllUserTokenBalances } from 'lib/hooks/useAllUserTokenBalances'
import { LoadingDots } from 'lib/components/LoadingDots'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { EtherscanAddressLink } from 'lib/components/EtherscanAddressLink'
import { useNetwork } from 'lib/hooks/useNetwork'
import { CheckboxInputGroup } from 'lib/components/CheckboxInputGroup'

import BatSvg from 'assets/images/bat-new-transparent.png'
import DaiSvg from 'assets/images/dai-new-transparent.png'
import UsdcSvg from 'assets/images/usdc-new-transparent.png'
import UsdtSvg from 'assets/images/usdt-new-transparent.png'
import WbtcSvg from 'assets/images/wbtc-new-transparent.png'
import ZrxSvg from 'assets/images/zrx-new-transparent.png'
import { formatEtherscanAddressUrl } from 'lib/utils/formatEtherscanAddressUrl'

const demoAssetTypes = {
  dai: { label: 'DAI', logo: DaiSvg },
  uni: { label: 'UNI Stake' },
  usdc: { label: 'USDC', logo: UsdcSvg },
  usdt: { label: 'USDT', logo: UsdtSvg }
}
const demoPools = {
  rinkeby: { chainId: 4, assets: ['dai', 'usdc', 'usdt'] }
}

export const IndexContent = (props) => {
  return (
    <>
      <PoolsLists />
    </>
  )
}

const PoolsLists = () => {
  const {
    data: createdPrizePools,
    isFetched: createdPrizePoolsIsFetched,
    isFetching: createdPrizePoolsIsFetching
  } = useAllCreatedPrizePoolsWithTokens()
  const {
    data: tokenBalances,
    isFetched: tokenBalancesIsFetched,
    isFetching: tokenBalancedIsFetching
  } = useAllUserTokenBalances()

  if (
    !createdPrizePoolsIsFetched ||
    !tokenBalancesIsFetched ||
    tokenBalancedIsFetching ||
    createdPrizePoolsIsFetching
  ) {
    return <LoadingDots />
  }

  return (
    <>
      <GovernancePoolsCard createdPrizePools={createdPrizePools} tokenBalances={tokenBalances} />
      <UsersPoolsCard createdPrizePools={createdPrizePools} tokenBalances={tokenBalances} />
      <ReferencePoolCard />
      <DemoPoolsCard />
      <AllPoolsCard createdPrizePools={createdPrizePools} tokenBalances={tokenBalances} />
    </>
  )
}

const ReferencePoolCard = () => {
  const [network, setNetwork] = useState('mainnet')
  const [contractAddress, setContractAddress] = useState('')

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

  return (
    <>
      <Card>
        <Collapse title='🔍 Lookup pool by contract address'>
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

          <div className='mt-4 ml-auto'>
            <ButtonLink
              size='base'
              color='secondary'
              as={`/pools/${network}/${contractAddress}/home`}
              href='/pools/[networkName]/[prizePoolAddress]/home'
              paddingClasses='px-10 py-1'
              className='ml-auto'
              disabled={!contractAddress}
            >
              View Pool
            </ButtonLink>
          </div>
        </Collapse>
      </Card>
    </>
  )
}

const DemoPoolsCard = (props) => {
  const walletContext = useContext(WalletContext)
  const walletNetwork = walletContext._onboard.getState().network

  const demoNetworkName = findKey(demoPools, { chainId: walletNetwork })
  const demoPool = find(demoPools, { chainId: walletNetwork })

  let networkDemoPools = []

  demoPool?.assets.forEach((assetType) => {
    const address = getDemoPoolContractAddress(demoNetworkName, assetType)
    if (address) {
      networkDemoPools.push({
        assetType,
        address: getDemoPoolContractAddress(demoNetworkName, assetType)
      })
    }
  })

  if (networkDemoPools.length === 0) return null

  return (
    <Card>
      <div className='font-bold text-base sm:text-2xl text-accent-1 mb-4'>🧪 Demo Pools</div>
      {networkDemoPools.map((demoPool) => (
        <DemoPoolButton {...demoPool} networkName={demoNetworkName} />
      ))}
    </Card>
  )
}

const DemoPoolButton = (props) => {
  const { address, assetType, networkName } = props

  return (
    <Link
      key={`${networkName}-${assetType}`}
      href='/pools/[networkName]/[prizePoolAddress]/home'
      as={`/pools/${networkName}/${address}/home`}
    >
      <a>
        <div className='flex mb-4 last:mb-0 items-center py-2 px-4 inline-block bg-card hover:bg-card-selected trans border-2 border-highlight-3 hover:border-highlight-2 border-dashed rounded-lg '>
          {demoAssetTypes[assetType]?.logo && (
            <img
              src={demoAssetTypes[assetType]?.logo}
              className='inline-block w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 mr-2'
            />
          )}

          <div className='flex flex-col'>
            <span className='text-blue text-base leading-none mb-1'>
              {upperFirst(networkName)} {demoAssetTypes[assetType]?.label} Pool
            </span>
            <span className='text-xxs sm:text-base inline-block leading-none relative text-accent-3'>
              {shorten(address)}{' '}
              <span className='uppercase text-accent-3 opacity-50'>TESTNET DEMO</span>
            </span>
          </div>

          <span className='ml-auto text-green-1 font-bold text-sm sm:text-base'>View pool</span>
        </div>
      </a>
    </Link>
  )
}

const GovernancePoolsCard = (props) => {
  const { createdPrizePools, tokenBalances } = props
  const walletContext = useContext(WalletContext)
  const { id: chainId } = useNetwork()
  const [hideNoDeposits, setHideNoDeposits] = useState(false)

  const isWalletConnected = Boolean(walletContext._onboard.getState().address)

  const pools = useMemo(() => {
    if (!createdPrizePools || !tokenBalances || !isWalletConnected) return []

    const pools = []

    for (const prizePool of createdPrizePools) {
      const token = tokenBalances[prizePool.token]
      const ticket = tokenBalances[prizePool.ticket]

      if (hideNoDeposits && Number(ticket.totalSupply) === 0) continue

      // Add to governance pools if owned by the timelock address
      if (prizePool.prizePoolOwner === CONTRACT_ADDRESSES[chainId].GovernanceTimelock) {
        const row = (
          <PoolRow key={prizePool.prizePool} prizePool={prizePool} token={token} ticket={ticket} />
        )
        pools.push(row)
      }
    }

    pools.sort(sortByTvl)

    return pools
  }, [createdPrizePools, tokenBalances, isWalletConnected, hideNoDeposits])

  if (pools.length === 0) return null

  return (
    <Card>
      <Collapse
        title='🏆 Governance Pools'
        containerClassName='mb-4 xs:mb-8'
        headerMarginClassName='mb-4'
        renderCustomIcon={({ showContent }) => (
          <FeatherIcon
            icon='settings'
            className={classnames(
              'ml-3 sm:ml-4 my-auto w-3 h-3 sm:w-4 sm:h-4 my-auto stroke-current text-accent-1 trans',
              {
                'rotate-90': showContent
              }
            )}
          />
        )}
      >
        <CheckboxInputGroup
          checked={hideNoDeposits}
          handleClick={() => setHideNoDeposits(!hideNoDeposits)}
          label='Hide pools with no deposits'
          marginClasses=''
        />
      </Collapse>
      <ListHeaders />
      <ul>{pools}</ul>
    </Card>
  )
}

const UsersPoolsCard = (props) => {
  const { createdPrizePools, tokenBalances } = props

  const walletContext = useContext(WalletContext)

  const isWalletConnected = Boolean(walletContext._onboard.getState().address)

  const pools = useMemo(() => {
    if (!createdPrizePools || !tokenBalances || !isWalletConnected) return []

    const pools = []

    for (const prizePool of createdPrizePools) {
      const token = tokenBalances[prizePool.token]
      const ticket = tokenBalances[prizePool.ticket]

      // Add to user pools if user has a balance
      if (Number(ticket.balance) !== 0) {
        const row = (
          <PoolRow key={prizePool.prizePool} prizePool={prizePool} token={token} ticket={ticket} />
        )
        pools.push(row)
      }
    }

    pools.sort(sortByTvl)

    return pools
  }, [createdPrizePools, tokenBalances, isWalletConnected])

  if (pools.length === 0) return null

  return (
    <Card>
      <div className='font-bold text-base sm:text-2xl text-accent-1 mb-4'>🎟 My Pools</div>
      <ListHeaders />
      <ul>{pools}</ul>
    </Card>
  )
}

const AllPoolsCard = (props) => {
  const { createdPrizePools, tokenBalances } = props

  const [hideNoDeposits, setHideNoDeposits] = useState(true)
  const [showFirstTen, setShowFirstTen] = useState(true)

  const pools = useMemo(() => {
    if (!createdPrizePools || !tokenBalances) return []

    const pools = []

    for (const prizePool of createdPrizePools) {
      const token = tokenBalances[prizePool.token]
      const ticket = tokenBalances[prizePool.ticket]

      if (hideNoDeposits && Number(ticket.totalSupply) === 0) continue

      const row = (
        <PoolRow key={prizePool.prizePool} prizePool={prizePool} token={token} ticket={ticket} />
      )
      pools.push(row)
    }

    pools.sort(sortByTvl)

    if (showFirstTen) return pools.slice(0, 10)

    return pools
  }, [createdPrizePools, tokenBalances, hideNoDeposits, showFirstTen])

  return (
    <Card>
      <Collapse
        title='🤿 All Pools'
        containerClassName='mb-4 xs:mb-8'
        headerMarginClassName='mb-4'
        renderCustomIcon={({ showContent }) => (
          <FeatherIcon
            icon='settings'
            className={classnames(
              'ml-3 sm:ml-4 my-auto w-3 h-3 sm:w-4 sm:h-4 my-auto stroke-current text-accent-1 trans',
              {
                'rotate-90': showContent
              }
            )}
          />
        )}
      >
        <CheckboxInputGroup
          checked={hideNoDeposits}
          handleClick={() => setHideNoDeposits(!hideNoDeposits)}
          label='Hide pools with no deposits'
          marginClasses=''
        />
      </Collapse>
      <ListHeaders />
      <ul>{pools}</ul>
      {showFirstTen && (
        <div className='flex'>
          <button
            className='mx-auto trans hover:text-accent-1'
            onClick={(e) => {
              e.preventDefault()
              setShowFirstTen(false)
            }}
          >
            Show all
          </button>
        </div>
      )}
    </Card>
  )
}

const sortByTvl = (a, b) => Number(b.props.ticket.totalSupply) - Number(a.props.ticket.totalSupply)

const ListHeaders = (props) => {
  const walletContext = useContext(WalletContext)
  const isWalletConnected = Boolean(walletContext._onboard.getState().address)

  return (
    <div className='w-full flex text-accent-1 text-xs mb-2'>
      <span className='w-1/4 mr-2'>Title</span>
      <span className='w-1/6 hidden sm:block'>Type</span>
      {isWalletConnected && <span className='w-1/6 hidden xs:block'>Ticket balance</span>}
      <span className='w-1/6 hidden xs:block'>Total deposits</span>
    </div>
  )
}

const PoolRow = (props) => {
  const walletContext = useContext(WalletContext)
  const isWalletConnected = Boolean(walletContext._onboard.getState().address)

  return (
    <li className='flex flex-row mb-4 last:mb-0 w-full'>
      <PoolTitleCell {...props} />
      <TypeCell {...props} />
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
    <div className='flex flex-col w-3/4 xs:w-1/4 mr-2'>
      <div className='flex'>
        {imageUrl && <img src={imageUrl} className='w-8 h-8 mr-4 my-auto rounded-full' />}
        {name}
      </div>
      {/* TODO: Special pill if owned by governance */}
      <span className='text-accent-1 text-xxs'>
        Owned by: <OwnerAddress ownerAddress={prizePoolOwner} />
      </span>
    </div>
  )
}

const TypeCell = (props) => {
  const { prizePool } = props
  const { type } = prizePool
  return <span className='w-1/6 hidden sm:block'>{type}</span>
}

const TvlCell = (props) => {
  const { ticket, token } = props
  const amount = ticket.totalSupply.toString()
  return (
    <span className='w-1/6 hidden xs:block'>
      {numberWithCommas(amount)}
      <span className='ml-1 text-xs text-accent-1'>{token.symbol}</span>
    </span>
  )
}

const UsersBalanceCell = (props) => {
  const { ticket } = props
  const balance = ticket.balance.toString()

  return (
    <span className='w-1/6 hidden xs:block'>
      {numberWithCommas(balance)}
      <span className='ml-1 text-xs text-accent-1'>{ticket.symbol}</span>
    </span>
  )
}

const OwnerAddress = (props) => {
  const { ownerAddress } = props
  const { id: chainId } = useNetwork()
  const url = formatEtherscanAddressUrl(ownerAddress, chainId)

  if (ownerAddress === CONTRACT_ADDRESSES[chainId].GovernanceTimelock) {
    return (
      <a
        href={url}
        className={`trans font-number hover:text-inverse bg-purple-1 rounded-full px-2`}
        target='_blank'
        rel='noopener noreferrer'
        title='View on Etherscan'
      >
        <span className='inline-block '>PoolTogether</span>
        <FeatherIcon icon='external-link' className='is-etherscan-arrow ml-1 inline-block' />
      </a>
    )
  }

  return (
    <a
      href={url}
      className={`trans font-number hover:text-inverse`}
      target='_blank'
      rel='noopener noreferrer'
      title='View on Etherscan'
    >
      <span className='inline-block'>{shorten(ownerAddress)}</span>
      <FeatherIcon icon='external-link' className='is-etherscan-arrow ml-1 inline-block' />
    </a>
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
        color='tertiary'
        as={`/pools/${networkName}/${prizePoolAddress}/home`}
        href='/pools/[networkName]/[prizePoolAddress]/home'
        paddingClasses='px-10 py-1'
        className='ml-auto'
      >
        View Pool
      </ButtonLink>
    </div>
  )
}

// demoPool?.assets.forEach((assetType) => {
//   const address = getDemoPoolContractAddress(demoNetworkName, assetType)
//   if (address) {
//     networkDemoPools.push({
//       assetType,
//       address: getDemoPoolContractAddress(demoNetworkName, assetType)
//     })
//   }
// })

// return (
//   <>
//     <div className='flex mt-10 mb-6 sm:mb-10 lg:justify-between'>
//       <div className='flex-grow'>
//         <h1 className='text-accent-1 title text-xl sm:text-6xl'>Community Prize Pools</h1>

//         <h3 className='text-accent-1 mt-2 xs:mt-6 mb-4 text-base sm:text-3xl'>Pool List</h3>

//         <Card>
//           <div className='flex w-full pt-2 pb-2'>
//             <span className='text-accent-1 text-xs w-1/3'>Deposit token</span>
//             <span className='text-accent-1 text-xs w-1/3'>Type</span>
//           </div>

//           <PoolRow poolAlias={POOL_ALIASES.bond} />
//           <PoolRow poolAlias={POOL_ALIASES.dpi} />
//           <PoolRow poolAlias={POOL_ALIASES.rai} />
//         </Card>
//       </div>
//     </div>

//     <div className='w-full lg:mx-auto'>
//       {demoPool && (
//         <>
//           <h3 className='text-accent-1 mt-2 xs:mt-6 mb-4 text-base sm:text-3xl'>Demo Pools</h3>

//           <div className='flex justify-center flex-col sm:flex-row sm:flex-wrap -mx-4 mb-8 text-xs sm:text-lg lg:text-xl'>
//             {networkDemoPools?.length === 0 ? (
//               <>
//                 <div className='text-center text-caption uppercase text-sm font-bold text-default rounded-lg bg-default p-4'>
//                   No demo pools deployed to this network yet...
//                 </div>
//               </>
//             ) : (
//               <>
//                 {map(networkDemoPools, (pool) => {
//                   return (
//                     <Link
//                       key={`${demoNetworkName}-${pool.assetType}`}
//                       href='/pools/[networkName]/[prizePoolAddress]'
//                       as={`/pools/${demoNetworkName}/${pool.address}`}
//                     >
//                       <a className='w-full sm:w-1/2 lg:w-1/3 px-4 border-2 border-transparent hover:border-transparent'>
//                         <div className='flex items-center mb-2 py-2 px-4 inline-block bg-card hover:bg-card-selected trans border-2 border-highlight-3 hover:border-highlight-2 border-dashed rounded-lg '>
//                           {demoAssetTypes[pool.assetType]?.logo && (
//                             <img
//                               src={demoAssetTypes[pool.assetType]?.logo}
//                               className='inline-block w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 mr-2'
//                             />
//                           )}

//                           <div>
//                             <span className='text-blue text-base'>
//                               {upperFirst(demoNetworkName)}{' '}
//                               {demoAssetTypes[pool.assetType]?.label} Pool
//                             </span>
//                             <br />
//                             <span className='text-xxs sm:text-base inline-block -t-1 relative text-accent-3'>
//                               {shorten(pool.address)}{' '}
//                               <span className='uppercase text-accent-3 opacity-50'>
//                                 TESTNET DEMO
//                               </span>
//                             </span>
//                           </div>
//                         </div>
//                       </a>
//                     </Link>
//                   )
//                 })}
//               </>
//             )}
//           </div>
//         </>
//       )}

//       <Card>
//         <Collapse title='Lookup pool by contract address'>
//           <form
//             onSubmit={(e) => {
//               e.preventDefault()

//               window.location.href = `/pools/${network}/${contractAddress}`
//             }}
//           >
//             <DropdownInputGroup
//               id='network-dropdown'
//               label={'Network the Pool is on:'}
//               formatValue={formatValue}
//               onValueSet={onValueSet}
//               current={network}
//               values={networks}
//             />

//             <TextInputGroup
//               id='contractAddress'
//               label={<>Prize Pool contract address:</>}
//               required
//               onChange={(e) => setContractAddress(e.target.value)}
//               value={contractAddress}
//             />

//             <div className='my-5'>
//               <Button color='primary' size='lg'>
//                 View Pool
//               </Button>
//             </div>
//           </form>
//         </Collapse>
//       </Card>
//     </div>
//   </>
// )
// }
