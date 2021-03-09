import React, { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useAtom } from 'jotai'
import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'

import { Button } from 'lib/components/Button'
import { RightLabelButton, TextInputGroup } from 'lib/components/TextInputGroup'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { poolChainValuesAtom } from 'lib/hooks/usePoolChainValues'
import { userChainValuesAtom } from 'lib/hooks/useUserChainValues'
import { InnerCard } from 'lib/components/Card'
import { useDebounce } from 'lib/hooks/useDebounce'
import { fetchExitFee } from 'lib/utils/fetchExitFee'
import { useNetwork } from 'lib/hooks/useNetwork'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { poolAddressesAtom } from 'lib/hooks/usePoolAddresses'
import { usersAddressAtom } from 'lib/hooks/useUsersAddress'
import { sendTx } from 'lib/utils/sendTx'

import Warning from 'assets/images/warning.svg'
import { poolToast } from 'lib/utils/poolToast'
import { calculateOdds } from 'lib/utils/calculateOdds'
import { Gauge } from 'lib/components/Gauge'
import { addSeconds } from 'date-fns'
import { subtractDates } from 'lib/utils/subtractDates'
import { getErc20InputProps } from 'lib/utils/getErc20InputProps'

const handleWithdrawInstantly = async (
  setTx,
  provider,
  contractAddress,
  ticketAddress,
  usersAddress,
  withdrawAmount,
  maxExitFee,
  decimals
) => {
  if (!withdrawAmount) {
    poolToast.error(`Withdraw Amount needs to be filled in`)
    return
  }

  const params = [
    usersAddress,
    ethers.utils.parseUnits(withdrawAmount, decimals),
    ticketAddress,
    maxExitFee
  ]

  await sendTx(
    setTx,
    provider,
    contractAddress,
    PrizePoolAbi,
    'withdrawInstantlyFrom',
    params,
    'Withdraw'
  )
}

export const WithdrawForm = (props) => {
  const { setTx, withdrawAmount, setWithdrawAmount } = props

  const walletContext = useContext(WalletContext)
  const [poolAddresses] = useAtom(poolAddressesAtom)
  const [usersAddress] = useAtom(usersAddressAtom)
  const [poolChainValues] = useAtom(poolChainValuesAtom)
  const [usersChainValues] = useAtom(userChainValuesAtom)
  const [chainId, networkName] = useNetwork()

  const [exitFees, setExitFees] = useState({
    earlyExitFee: null,
    timelockDurationSeconds: null,
    credit: null,
    fetched: false
  })
  const debouncedWithdrawAmount = useDebounce(withdrawAmount, 300)

  const { prizePool, ticket: ticketAddress } = poolAddresses
  const provider = walletContext.state.provider
  const { usersTicketBalance } = usersChainValues
  const { earlyExitFee, timelockDurationSeconds } = exitFees
  const { isRngRequested, tokenDecimals, maxTimelockDuration } = poolChainValues
  const poolIsLocked = isRngRequested
  const tokenSymbol = poolChainValues.tokenSymbol

  const handleSubmit = (e) => {
    e.preventDefault()

    handleWithdrawInstantly(
      setTx,
      provider,
      prizePool,
      ticketAddress,
      usersAddress,
      withdrawAmount,
      earlyExitFee,
      tokenDecimals
    )
  }

  useEffect(() => {
    const t = async () => {
      if (debouncedWithdrawAmount) {
        const result = await fetchExitFee(
          networkName,
          usersAddress,
          prizePool,
          ticketAddress,
          ethers.utils.parseUnits(debouncedWithdrawAmount, tokenDecimals)
        )
        setExitFees(result)
      } else {
        setExitFees({
          earlyExitFee: null,
          timelockDurationSeconds: null,
          credit: null,
          fetched: false
        })
      }
    }

    t()
  }, [debouncedWithdrawAmount])

  const withdrawAmountBN = withdrawAmount
    ? ethers.utils.parseUnits(withdrawAmount, tokenDecimals)
    : ethers.BigNumber.from(0)
  const overBalance = withdrawAmountBN.gt(usersTicketBalance)
  const ticketBal =
    usersTicketBalance && tokenDecimals
      ? ethers.utils.formatUnits(usersTicketBalance, tokenDecimals)
      : '0'

  const { ticketDecimals, ticketTotalSupply, numberOfWinners } = poolChainValues
  const totalSupplyLessWithdrawAmountBN = ticketTotalSupply
    ? ticketTotalSupply.sub(withdrawAmountBN)
    : ethers.BigNumber.from(0)

  const newOdds = calculateOdds(
    usersTicketBalance.sub(withdrawAmountBN),
    totalSupplyLessWithdrawAmountBN,
    ticketDecimals,
    numberOfWinners
  )
  const formattedOdds = numberWithCommas(newOdds, { precision: 2 })

  if (poolIsLocked) {
    return (
      <InnerCard className='text-center'>
        <img src={Warning} className='w-10 sm:w-14 mx-auto mb-4' />
        <div className='text-accent-1 mb-4'>
          This Prize Pool is unable to withdraw at this time.
        </div>
        <div className='text-accent-1'>Withdraws can be made once the prize has been awarded.</div>
        <div className='text-accent-1'>Check back soon!</div>
      </InnerCard>
    )
  }

  if (!poolIsLocked && usersTicketBalance && usersTicketBalance.lte(0)) {
    return (
      <div className='text-orange-600'>
        You have no tickets to withdraw. Deposit some {tokenSymbol} first!
      </div>
    )
  }

  const { min, step } = getErc20InputProps(tokenDecimals)

  return (
    <>
      <form onSubmit={handleSubmit}>
        <TextInputGroup
          id='withdrawAmount'
          name='withdrawAmount'
          label='Withdraw amounts'
          required
          isError={overBalance}
          type='number'
          min={min}
          step={step}
          unit={tokenSymbol}
          onChange={(e) => setWithdrawAmount(e.target.value)}
          value={withdrawAmount}
          rightLabel={
            <RightLabelButton
              onClick={(e) => {
                e.preventDefault()
                setWithdrawAmount(ticketBal)
              }}
            >
              {numberWithCommas(ticketBal, { precision: tokenDecimals, removeTrailingZeros: true })}{' '}
              {tokenSymbol}
            </RightLabelButton>
          }
        />

        {overBalance && (
          <div className='text-xs sm:text-sm text-red-600 sm:ml-4'>
            The maximum you can withdraw is{' '}
            {displayAmountInEther(usersTicketBalance, {
              precision: 2,
              decimals: tokenDecimals
            })}{' '}
            {tokenSymbol}.
          </div>
        )}

        {withdrawAmount && !overBalance && (
          <span className='text-xs sm:text-sm text-orange-500 ml-0 sm:ml-4'>
            {newOdds ? (
              <>
                After withdrawing{' '}
                <b>
                  {withdrawAmount} {tokenSymbol}
                </b>{' '}
                your odds of winning would be <b>1 in {formattedOdds}</b>
              </>
            ) : (
              `Withdrawing everything will make you ineligible to win`
            )}
          </span>
        )}

        {earlyExitFee && !earlyExitFee.isZero() && (
          <div className='flex mt-8 sm:mb-0 flex-col sm:flex-row'>
            <WithdrawGauge
              timelockDurationSeconds={timelockDurationSeconds}
              maxTimelockDuration={maxTimelockDuration}
            />

            <InnerCard className='text-center height-fit-content sm:mt-6'>
              <div className='text-base sm:text-xl text-accent-1 mb-4'>
                Oh no! You're attempting to withdraw early and therefore, are subject to a fairness
                fee.
              </div>
              <a
                href='https://docs.pooltogether.com/protocol/prize-pool/fairness'
                target={'_blank'}
                className={'underline text-accent-1 trans hover:opacity-50 text-center mx-auto'}
              >
                Read more about Fairness
              </a>
            </InnerCard>
          </div>
        )}

        <WithdrawButtons
          exitFees={exitFees}
          resetForm={() => {
            setWithdrawAmount('')
          }}
          tokenSymbol={tokenSymbol}
          tokenDecimals={tokenDecimals}
        />
      </form>
    </>
  )
}

const WithdrawButtons = (props) => {
  const { overBalance, resetForm, exitFees, tokenSymbol, tokenDecimals } = props
  const { earlyExitFee, fetched: exitFeesFetched } = exitFees

  if (earlyExitFee && !earlyExitFee.isZero()) {
    return (
      <div className='my-5 flex flex-col sm:flex-row '>
        <Button
          disabled={overBalance}
          color='secondary'
          size='lg'
          fullWidth
          type='button'
          className='mr-4'
          onClick={(e) => {
            e.preventDefault()
            resetForm()
          }}
        >
          Cancel withdrawal
        </Button>
        <Button color='text_warning' size='lg' fullWidth className='ml-0 sm:ml-4 mt-4 sm:mt-0'>
          {`Withdraw anyway and pay ${ethers.utils.formatUnits(earlyExitFee, tokenDecimals)}
           ${tokenSymbol}`}
        </Button>
      </div>
    )
  }

  return (
    <div className='my-5 flex flex-col sm:flex-row '>
      <Button disabled={overBalance || !exitFeesFetched} color='warning' size='lg'>
        Withdraw
      </Button>
    </div>
  )
}

const WithdrawGauge = (props) => {
  const { timelockDurationSeconds, maxTimelockDuration } = props

  const percentTimeRemaining =
    timelockDurationSeconds &&
    maxTimelockDuration &&
    Math.round((timelockDurationSeconds.toNumber() / maxTimelockDuration.toNumber()) * 100)
  const { time, timeType } = getTimeLeftDisplayValues(timelockDurationSeconds.toNumber())

  return (
    <>
      <div className='hidden sm:block mr-0 sm:mr-20 ml-0 sm:ml-8' style={{ maxHeight: '240px' }}>
        <Gauge
          value={Math.abs(100 - percentTimeRemaining)}
          label={<GaugeLabel time={time} timeType={timeType} />}
        />
      </div>
      <div className='block sm:hidden text-orange-500 text-center mb-2'>
        {time} more {timeType} to go until free withdrawal
      </div>
    </>
  )
}

const getTimeLeftDisplayValues = (secondsLeft) => {
  const currentDate = new Date(Date.now())
  const futureDate = addSeconds(currentDate, secondsLeft)
  const { days, hours, minutes, seconds } = subtractDates(futureDate, currentDate)

  let time = 0
  let timeType = ''
  if (days) {
    time = days
    timeType = days === 1 ? 'day' : 'days'
  } else if (hours) {
    time = hours
    timeType = hours === 1 ? 'hour' : 'hours'
  } else if (minutes) {
    time = minutes
    timeType = minutes === 1 ? 'minute' : 'minutes'
  } else {
    time = seconds
    timeType = seconds === 1 ? 'second' : 'seconds'
  }
  return { time, timeType }
}

const GaugeLabel = (props) => {
  const { time, timeType } = props

  return (
    <div className='flex flex-col'>
      <div className='text-8xl text-highlight-1 leading-none mt-4 font-bold'>{time}</div>
      <div className='text-xl text-highlight-1 mb-6 font-bold'>{timeType} left</div>
      <div className='text-highlight-1'>
        {time} more {timeType} to go until free withdrawal
      </div>
    </div>
  )
}
