import React, { useState } from 'react'
import { ethers } from 'ethers'

import { Card, CardDetailsList, CardTitle } from 'lib/components/Card'
import { usePoolChainValues } from 'lib/hooks/usePoolChainValues'

import CompSvg from 'assets/images/comp.svg'
import { PoolNumber } from 'lib/components/PoolNumber'
import { Tooltip } from 'lib/components/Tooltip'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { displayPercentage } from 'lib/utils/displayPercentage'
import { usePrizePoolType } from 'lib/hooks/usePrizePoolType'
import { PRIZE_POOL_TYPE } from 'lib/constants'
import { BlockExplorerLink, LinkIcon } from 'lib/components/BlockExplorerLink'
import { useNetwork } from 'lib/hooks/useNetwork'
import { usePrizePoolContracts } from 'lib/hooks/usePrizePoolContracts'

const PoolStatsCard = (props) => {
  const [smallView, setSmallView] = useState(true)
  return (
    <Card>
      <div className='flex justify-between'>
        <CardTitle>Prize Pool Info</CardTitle>
      </div>
      <CardDetailsList>{props.children}</CardDetailsList>
    </Card>
  )
}

export const PoolStats = () => (
  <PoolStatsCard>
    <CompleteStatsList />
  </PoolStatsCard>
)

export const PoolDepositorStats = () => (
  <PoolStatsCard>
    <DepositorStatsList />
  </PoolStatsCard>
)

const CompleteStatsList = (props) => {
  const { poolChainValues } = props
  return null
}

const DepositorStatsList = (props) => {
  const { data: poolChainValues } = usePoolChainValues()

  return (
    <>
      <NumberOfWinnersStat poolChainValues={poolChainValues} />
      <DepositTokenStat poolChainValues={poolChainValues} />
      <DepositsStat poolChainValues={poolChainValues} />
      <SponsorshipStat poolChainValues={poolChainValues} />
      <YieldSourceStat poolChainValues={poolChainValues} />
      <PoolOwnerStat poolChainValues={poolChainValues} />
    </>
  )
}

// Generic stat component

const Stat = (props) => {
  const {
    title,
    tokenSymbol,
    convertedValue,
    sourceName,
    sourceImage,
    tokenAmount,
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
      {(sourceImage || value) && (
        <span className='flex items-center'>
          {sourceName && <span className='capitalize mr-2'>{sourceName}</span>}
          {sourceImage && <img src={sourceImage} className='w-6 mr-2' />}
          {value && <span>{value}</span>}
        </span>
      )}
      {tokenSymbol && tokenAmount && (
        <span>
          {Boolean(convertedValue) && (
            <>
              <span className='opacity-30'>(${numberWithCommas(convertedValue)})</span>{' '}
            </>
          )}
          <PoolNumber>{numberWithCommas(tokenAmount)}</PoolNumber>
          <span>{tokenSymbol}</span>
        </span>
      )}
      {percent && <span>{displayPercentage(percent)}%</span>}
    </li>
  )
}

// Stat components

const DepositsStat = (props) => (
  <Stat
    title='Total deposits'
    tokenAmount={props.poolChainValues.ticket.totalSupply}
    tokenSymbol={props.poolChainValues.token.symbol}
  />
)

const SponsorshipStat = (props) => (
  <Stat
    title='Total sponsorship'
    tokenAmount={props.poolChainValues.sponsorship.totalSupply}
    tokenSymbol={props.poolChainValues.token.symbol}
  />
)

const PoolOwnerStat = (props) => (
  <Stat
    title='Pool owner'
    value={<BlockExplorerLink address={props.poolChainValues.config.owner}></BlockExplorerLink>}
  />
)

const NumberOfWinnersStat = (props) => (
  <Stat title='Number of winners' value={props.poolChainValues.config.numberOfWinners} />
)
const DepositTokenStat = (props) => (
  <Stat
    title='Deposit token'
    value={<BlockExplorerLink address={props.poolChainValues.token.address}></BlockExplorerLink>}
  />
)

// const ReserveStat = (props) => {
//   const { pool } = props

//   const { t } = useTranslation()

//   const reserveAmount = ethers.utils.formatUnits(
//     pool.reserveTotalSupply,
//     pool.underlyingCollateralDecimals
//   )

//   return (
//     <Stat
//       title={t('reserve')}
//       convertedValue={pool.totalReserveUSD}
//       tokenSymbol={pool.underlyingCollateralSymbol}
//       tokenAmount={reserveAmount}
//       tooltip={t('reserveInfo')}
//     />
//   )
// }

// const ReserveRateStat = (props) => {
//   const { pool } = props

//   const { t } = useTranslation()

//   const reserveRatePercentage = pool.reserveRate.mul(100)
//   const reserveRate = ethers.utils.formatUnits(reserveRatePercentage, DEFAULT_TOKEN_PRECISION)

//   return <Stat title={t('reserveRate')} percent={reserveRate} tooltip={t('reserveRateInfo')} />
// }
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
    sourceName = '--'
  }

  return (
    <Stat
      title='Yield Source'
      value={
        <BlockExplorerLink address={yieldSourceAddress}>
          <LinkIcon />
        </BlockExplorerLink>
      }
      sourceName={sourceName}
      sourceImage={sourceImage}
    />
  )
}

// audited vs unaudited

// APR Stats

const AprStats = (props) => {
  const { pool } = props

  const apr = useTokenFaucetAPR(pool)

  if (!apr) return null

  return (
    <>
      <hr />
      <DailyPoolDistributionStat poolChainValues={poolChainValues} />
      <EffectiveAprStat apr={apr} />
    </>
  )
}

const DailyPoolDistributionStat = (props) => {
  const { pool } = props

  const { t } = useTranslation()
  const { data, isFetched } = useTokenFaucetData(pool.tokenListener)

  let tokenAmount = '0'
  if (isFetched) {
    const dripRatePerDay = data.dripRatePerSecond.mul(SECONDS_PER_DAY)
    tokenAmount = ethers.utils.formatUnits(dripRatePerDay, DEFAULT_TOKEN_PRECISION)
  }

  return <Stat title={t('dailyPoolDistribution')} tokenSymbol={'POOL'} tokenAmount={tokenAmount} />
}

const EffectiveAprStat = (props) => {
  const { apr } = props

  const { t } = useTranslation()

  return <Stat title={t('effectiveApr')} percent={apr} tooltip={t('effectiveAprInfo')} />
}
