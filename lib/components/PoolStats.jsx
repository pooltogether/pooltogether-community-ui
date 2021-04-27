import React from 'react'
import { ethers } from 'ethers'

import { Card, CardDetailsList, CardTitle } from 'lib/components/Card'
import { usePoolChainValues } from 'lib/hooks/usePoolChainValues'
import { PoolNumber } from 'lib/components/PoolNumber'
import { Tooltip } from 'lib/components/Tooltip'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { displayPercentage } from 'lib/utils/displayPercentage'
import { usePrizePoolType } from 'lib/hooks/usePrizePoolType'
import { PRIZE_POOL_TYPE } from 'lib/constants'
import { BlockExplorerLink, LinkIcon } from 'lib/components/BlockExplorerLink'
import { useNetwork } from 'lib/hooks/useNetwork'
import { usePrizePoolContracts } from 'lib/hooks/usePrizePoolContracts'
import { useUserChainValues } from 'lib/hooks/useUserChainValues'
import { calculateOdds } from 'lib/utils/calculateOdds'
import { useUsersAddress } from 'lib/hooks/useUsersAddress'
import { getCreditMaturationDaysAndLimitPercentage } from 'lib/utils/format'
import { useTimeLeftBeforePrize } from 'lib/hooks/useTimeLeftBeforePrize'
import { useIsOwnerPoolTogether } from 'lib/hooks/useIsOwnerPoolTogether'
import { shorten } from 'lib/utils/shorten'

import CompSvg from 'assets/images/comp.svg'
import PoolSvg from 'assets/images/pool-icon.svg'

const PoolStatsCardLayout = (props) => {
  return (
    <Card>
      <div className='flex justify-between'>
        <CardTitle>Prize Pool Info</CardTitle>
      </div>
      <CardDetailsList>{props.children}</CardDetailsList>
    </Card>
  )
}

export const PoolStatsCard = () => (
  <PoolStatsCardLayout>
    <CompleteStatsList />
  </PoolStatsCardLayout>
)

export const PoolDepositorStatsCard = () => (
  <PoolStatsCardLayout>
    <DepositorStatsList />
  </PoolStatsCardLayout>
)

const CompleteStatsList = () => {
  const { data: poolChainValues } = usePoolChainValues()
  return (
    <>
      <TimeUntilPrizeState poolChainValues={poolChainValues} />

      <NumberOfWinnersStat poolChainValues={poolChainValues} />
      <DepositsStat poolChainValues={poolChainValues} />
      <SponsorshipStat poolChainValues={poolChainValues} />
      <YieldSourceStat poolChainValues={poolChainValues} />
      <DepositTokenStat poolChainValues={poolChainValues} />
      <PoolOwnerStat poolChainValues={poolChainValues} />
      <Line />
      <ExitFeeStats poolChainValues={poolChainValues} />
      <ReserveStat poolChainValues={poolChainValues} />
      <ReserveRateStat poolChainValues={poolChainValues} />
      <AprStats poolChainValues={poolChainValues} />
    </>
  )
}

const DepositorStatsList = () => {
  const { data: poolChainValues } = usePoolChainValues()

  return (
    <>
      <UsersStats poolChainValues={poolChainValues} />
      <Line />
      <NumberOfWinnersStat poolChainValues={poolChainValues} />
      <DepositsStat poolChainValues={poolChainValues} />
      <SponsorshipStat poolChainValues={poolChainValues} />
      <YieldSourceStat poolChainValues={poolChainValues} />
      <DepositTokenStat poolChainValues={poolChainValues} />
      <PoolOwnerStat poolChainValues={poolChainValues} />
      <AprStats poolChainValues={poolChainValues} />
    </>
  )
}

// Generic stat component

const Stat = (props) => {
  const {
    title,
    convertedValue,
    sourceName,
    sourceImage,
    tokenAmount,
    tokenSymbol,
    tokenImage,
    value,
    percent,
    tooltip
  } = props

  return (
    <li className='flex justify-between mb-2 last:mb-0'>
      <span className='text-accent-1 flex'>
        {title}:{' '}
        {tooltip && <Tooltip id={title} className='ml-2 my-auto text-accent-1' tip={tooltip} />}
      </span>
      <span className='flex items-center'>
        {sourceName && <span className='capitalize'>{sourceName}</span>}
        {sourceImage && <img src={sourceImage} className='ml-2 w-6' />}
        {value && <span className='ml-2 flex'>{value}</span>}
      </span>
      {tokenSymbol && tokenAmount && (
        <span className='flex items-center'>
          {Boolean(convertedValue) && (
            <>
              <span className='opacity-30'>(${numberWithCommas(convertedValue)})</span>{' '}
            </>
          )}
          <PoolNumber>{numberWithCommas(tokenAmount)}</PoolNumber>
          {tokenImage && <img src={tokenImage} className='ml-2 w-4' />}
          <span className='ml-2'>{tokenSymbol}</span>
        </span>
      )}
      {percent && <span>{displayPercentage(percent)}%</span>}
    </li>
  )
}

// Stat components

// Users stats

const UsersStats = (props) => {
  const usersAddress = useUsersAddress()

  const { data: usersChainValues, isFetched: usersChainValuesIsFetched } = useUserChainValues()
  const { data: poolChainValues, isFetched: poolChainValuesIsFetched } = usePoolChainValues()

  if (!usersAddress || !usersChainValuesIsFetched || !poolChainValuesIsFetched) return null

  return (
    <>
      <UsersDepositsStat
        {...props}
        poolChainValues={poolChainValues}
        usersChainValues={usersChainValues}
      />
      <UsersWalletBalanceStat
        {...props}
        poolChainValues={poolChainValues}
        usersChainValues={usersChainValues}
      />
      <UsersOddsStat
        {...props}
        poolChainValues={poolChainValues}
        usersChainValues={usersChainValues}
      />
    </>
  )
}

const UsersDepositsStat = (props) => {
  const { poolChainValues, usersChainValues } = props
  const { symbol, decimals } = poolChainValues.token
  const balance = numberWithCommas(usersChainValues.usersTicketBalance, { decimals })
  return <Stat title={'My deposits'} tokenAmount={balance} tokenSymbol={symbol} />
}

const UsersWalletBalanceStat = (props) => {
  const { poolChainValues, usersChainValues } = props
  const { symbol, decimals } = poolChainValues.token
  const balance = numberWithCommas(usersChainValues.usersTokenBalance, { decimals })
  return <Stat title={'My wallet balance'} tokenAmount={balance} tokenSymbol={symbol} />
}

const UsersOddsStat = (props) => {
  const { poolChainValues, usersChainValues } = props

  const odds = calculateOdds(
    usersChainValues?.usersTicketBalanceUnformatted,
    poolChainValues.ticket.totalSupplyUnformatted,
    poolChainValues.ticket.decimals,
    poolChainValues.config.numberOfWinners
  )

  if (!odds) {
    return <Stat title={'My winning odds'} value={<EmptyItem />} />
  }

  const formattedOdds = numberWithCommas(odds, { precision: 2 })

  return <Stat title={'My winning odds'} value={`1 in ${formattedOdds}`} />
}

// Pool stats

const DepositsStat = (props) => (
  <Stat
    title='Total deposits'
    tokenAmount={props.poolChainValues.ticket.totalSupply}
    tokenSymbol={props.poolChainValues.token.symbol}
  />
)

const SponsorshipStat = (props) => {
  if (props.poolChainValues.sponsorship.totalSupplyUnformatted.isZero()) return null
  return (
    <Stat
      title='Total sponsorship'
      tokenAmount={props.poolChainValues.sponsorship.totalSupply}
      tokenSymbol={props.poolChainValues.token.symbol}
      tooltip='Deposited funds contributing interest to the prize without being eligible to win'
    />
  )
}

const PoolOwnerStat = (props) => {
  const ownerAddress = props.poolChainValues.config.owner
  const ownerIsPoolTogether = useIsOwnerPoolTogether(ownerAddress)
  return (
    <Stat
      title='Pool owner'
      value={
        <BlockExplorerLink copyable address={ownerAddress}>
          {ownerIsPoolTogether ? 'PoolTogether' : shorten(ownerAddress)}
          <LinkIcon />
        </BlockExplorerLink>
      }
    />
  )
}

const NumberOfWinnersStat = (props) => (
  <Stat title='Winners / prize period' value={props.poolChainValues.config.numberOfWinners} />
)

const DepositTokenStat = (props) => (
  <Stat
    title='Deposit token'
    value={
      <BlockExplorerLink copyable shorten address={props.poolChainValues.token.address}>
        {props.poolChainValues.token.name}
        <LinkIcon />
      </BlockExplorerLink>
    }
  />
)

const ReserveStat = (props) => (
  <Stat
    title={'Reserve'}
    tokenSymbol={props.poolChainValues.token.symbol}
    tokenAmount={props.poolChainValues.reserve.balance}
    tooltip='Governance controlled funds contributing interest to the prize without being eligible to win'
  />
)

const ReserveRateStat = (props) => (
  <Stat
    title={'Reserve rate'}
    percent={props.poolChainValues.reserve.rate}
    tooltip='Percent of each prize deposited into reserve'
  />
)

const CUSTOM_YIELD_SOURCE_NAMES = {
  1: {
    '0x829df2cb6748b9fd619efcd23cc5c351957ecac9': 'rari'
  }
}

const CUSTOM_YIELD_SOURCE_IMAGES = {
  rari: '/custom-yield-source-images/rari.png'
}

const YieldSourceStat = (props) => {
  const prizePoolType = usePrizePoolType()
  const { chainId } = useNetwork()
  const { data: prizePoolContracts } = usePrizePoolContracts()
  const yieldSourceAddress = prizePoolContracts.yieldSource.address

  let sourceImage, sourceName
  if (prizePoolType === PRIZE_POOL_TYPE.compound) {
    sourceName = 'Compound Finance'
    sourceImage = CompSvg
  } else if (prizePoolType === PRIZE_POOL_TYPE.yield) {
    sourceName = CUSTOM_YIELD_SOURCE_NAMES?.[chainId]?.[yieldSourceAddress] || 'Custom Yield Source'
    sourceImage = '/ticket-bg--light-sm.png'
    const providedCustomImage = CUSTOM_YIELD_SOURCE_IMAGES[sourceName]
    if (providedCustomImage) {
      sourceImage = providedCustomImage
    }
  } else {
    sourceName = <EmptyItem />
  }

  return (
    <Stat
      title='Yield Source'
      value={
        yieldSourceAddress ? (
          <BlockExplorerLink address={yieldSourceAddress}>
            <LinkIcon />
          </BlockExplorerLink>
        ) : null
      }
      sourceName={sourceName}
      sourceImage={sourceImage}
    />
  )
}

const TimeUntilPrizeState = (props) => {
  const { days, hours, minutes, seconds } = useTimeLeftBeforePrize()
  return (
    <Stat
      title='Time to next prize'
      value={<TimeDisplay days={days} hours={hours} minutes={minutes} seconds={seconds} />}
    />
  )
}

const ExitFeeStats = (props) => {
  const { poolChainValues } = props
  const [creditMaturationInDays, creditLimitPercentage] = getCreditMaturationDaysAndLimitPercentage(
    poolChainValues.config.ticketCreditRateMantissa,
    poolChainValues.config.ticketCreditLimitMantissa
  )
  return (
    <>
      <CreditLimitPercentageStat creditLimitPercentage={creditLimitPercentage} />
      <CreditMaturationDaysStat creditMaturationInDays={creditMaturationInDays} />
    </>
  )
}

const CreditLimitPercentageStat = (props) => (
  <Stat title='Early exit fee' percent={props.creditLimitPercentage} />
)

const CreditMaturationDaysStat = (props) => (
  <Stat
    title='Exit fee decay time'
    value={`${props.creditMaturationInDays} day${props.creditMaturationInDays === 1 ? '' : 's'}`}
  />
)

// APR Stats

// TODO: Need to fetch data & token faucet address
const AprStats = (props) => {
  const { poolChainValues } = props
  const { data: prizePoolContracts } = usePrizePoolContracts()

  if (
    !prizePoolContracts.tokenListener ||
    prizePoolContracts.tokenListener.address === ethers.constants.AddressZero ||
    !poolChainValues.tokenFaucet
  ) {
    return null
  }

  return (
    <>
      <DailyPoolDistributionStat poolChainValues={poolChainValues} />
      {/* <EffectiveAprStat poolChainValues={poolChainValues} /> */}
    </>
  )
}

const DailyPoolDistributionStat = (props) => {
  const { poolChainValues } = props

  const isPool = poolChainValues.tokenFaucet.dripToken.symbol === 'POOL'

  return (
    <Stat
      title={`Daily ${poolChainValues.tokenFaucet.dripToken.symbol} distribution`}
      tokenSymbol={poolChainValues.tokenFaucet.dripToken.symbol}
      tokenAmount={poolChainValues.tokenFaucet.dripRatePerDay}
      tokenImage={isPool && PoolSvg}
    />
  )
}

const EffectiveAprStat = (props) => {
  const { apr } = props

  return (
    <Stat
      title={'Effective APR'}
      percent={apr}
      tooltip={'Current APR of deposited funds based on value of POOL tokens received'}
    />
  )
}

const EmptyItem = () => <span className='opacity-40'>--</span>

const Line = () => <hr className='mt-2 mb-4 sm:mb-8 sm:mt-6 opacity-60 xs:opacity-100' />

const TimeDisplay = (props) => {
  const { days, hours, minutes, seconds } = props

  if (days > 0) {
    if (hours > 0) {
      return (
        <>
          {days} day{days === 1 ? '' : 's'} {hours} hour{hours === 1 ? '' : 's'}
        </>
      )
    } else {
      return (
        <>
          {days} day{days === 1 ? '' : 's'} {minutes} minute{minutes === 1 ? '' : 's'}
        </>
      )
    }
  }

  return (
    <>
      {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:
      {String(seconds).padStart(2, '0')}
    </>
  )
}
