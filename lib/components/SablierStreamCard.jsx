import React from 'react'
import classnames from 'classnames'

import { Card } from 'lib/components/Card'
import { Collapse } from 'lib/components/Collapse'
import { getMaxPrecision, numberWithCommas } from 'lib/utils/numberWithCommas'
import { getDateFromSeconds } from 'lib/utils/getDateFromSeconds'
import { secondsSinceEpoch } from 'lib/utils/secondsSinceEpoch'
import { ethers } from 'ethers'
import compareVersions from 'compare-versions'
import { usePrizePoolContracts } from 'lib/hooks/usePrizePoolContracts'
import { usePoolChainValues } from 'lib/hooks/usePoolChainValues'

export const SablierStreamCard = (props) => {
  const { data: prizePoolContracts } = usePrizePoolContracts()
  const { data: poolChainValues } = usePoolChainValues()

  const { hideIfNoStream } = props

  const sablierStream = poolChainValues.prize.sablierStream

  if (!sablierStream.id) {
    if (hideIfNoStream) return null
    return <EmptySablierStreamState />
  }

  if (compareVersions(prizePoolContracts.prizeStrategy.version, '3.3.0') < 0) {
    return (
      <InvalidPrizeStrategyVersionForStreamState
        version={prizePoolContracts.prizeStrategy.version}
      />
    )
  }

  const { amountPerPrizePeriod, tokenSymbol, startTime, stopTime, totalDeposit } = sablierStream
  const prizePeriodSeconds = poolChainValues.prize.prizePeriodSeconds

  const currentTime = ethers.BigNumber.from(secondsSinceEpoch())
  const streamTotalTime = stopTime.sub(startTime)
  const currentTimeRelativeToStreamStart = currentTime.sub(startTime)
  const percentOfStreamDone = currentTimeRelativeToStreamStart.mul(100).div(streamTotalTime)
  const prizesToBeStreamedTo = streamTotalTime.div(prizePeriodSeconds)

  return (
    <Card>
      <Collapse title='Sablier Prize Stream'>
        <div className='flex flex-col xs:flex-row justify-between mt-6'>
          <div className='flex mb-2 xs:mb-0'>
            <h3 className='leading-none'>
              {numberWithCommas(amountPerPrizePeriod, {
                precision: getMaxPrecision(amountPerPrizePeriod)
              })}
            </h3>
            <span className='ml-2 mt-auto'>{`${tokenSymbol} in every prize`}</span>
          </div>

          <div className='flex mb-2 xs:mb-0'>
            <h3 className='leading-none'>
              {numberWithCommas(totalDeposit, {
                precision: getMaxPrecision(totalDeposit)
              })}
            </h3>
            <span className='ml-2 mt-auto'>{`${tokenSymbol} in total`}</span>
          </div>

          <div className='flex'>
            <h3 className='leading-none'>
              {numberWithCommas(prizesToBeStreamedTo, { precision: 0, decimals: 0 })}
            </h3>
            <span className='ml-2 mt-auto lowercase'>prizes</span>
          </div>
        </div>

        <div className='flex flex-col mt-6'>
          <div className='flex justify-between'>
            <span className='text-xxs'>
              {getDateFromSeconds(startTime.toString()).toDateString()}
            </span>
            <span className='text-xxs'>
              {getDateFromSeconds(stopTime.toString()).toDateString()}
            </span>
          </div>
          <StreamBar percentage={percentOfStreamDone} />
        </div>
      </Collapse>
    </Card>
  )
}

const StreamBar = (props) => {
  const { percentage } = props

  return (
    <div className={classnames('w-full h-2 flex flex-row rounded-full overflow-hidden mt-2')}>
      <div className='bg-secondary' style={{ width: `${percentage}%` }} />
      <div className='bg-tertiary' style={{ width: `${100 - percentage}%` }} />
    </div>
  )
}

const EmptySablierStreamState = () => {
  return (
    <Card>
      <Collapse title='Sablier Prize Stream'>Currently no stream available</Collapse>
    </Card>
  )
}

const InvalidPrizeStrategyVersionForStreamState = (props) => {
  return (
    <Card>
      <Collapse title='Sablier Prize Stream'>
        Prize Strategy v{props.version} does not support Sablier streams. Please deploy a new Prize
        Strategy of at least v3.3.0.
      </Collapse>
    </Card>
  )
}
