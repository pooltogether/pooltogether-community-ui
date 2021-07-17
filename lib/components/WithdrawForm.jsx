import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { addSeconds } from 'date-fns'
import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'

import { Button } from 'lib/components/Button'
import { RightLabelButton, TextInputGroup } from 'lib/components/TextInputGroup'
import { Gauge } from 'lib/components/Gauge'
import { InnerCard } from 'lib/components/Card'
import { useDebounce } from 'lib/hooks/useDebounce'
import { useNetwork } from 'lib/hooks/useNetwork'
import { usePoolChainValues } from 'lib/hooks/usePoolChainValues'
import { useReadProvider, useUsersAddress } from '@pooltogether/hooks'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { useUserChainValues } from 'lib/hooks/useUserChainValues'
import { calculateOdds } from 'lib/utils/calculateOdds'
import { fetchExitFee } from 'lib/utils/fetchExitFee'
import { getErc20InputProps } from 'lib/utils/getErc20InputProps'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { poolToast } from 'lib/utils/poolToast'
import { parseNumString } from 'lib/utils/parseNumString'
import { subtractDates } from 'lib/utils/subtractDates'

import Warning from 'assets/images/warning.svg'
import { usePrizePoolContracts } from 'lib/hooks/usePrizePoolContracts'

const handleWithdrawInstantly = async (
  sendTx,
  setTx,
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

  await sendTx(setTx, contractAddress, PrizePoolAbi, 'withdrawInstantlyFrom', 'Withdraw', params)
}

export const WithdrawForm = (props) => {
  const { setTx, withdrawAmount, setWithdrawAmount } = props
  const { data: prizePoolContracts } = usePrizePoolContracts()
  const { data: poolChainValues } = usePoolChainValues()
  const { data: usersChainValues } = useUserChainValues()
  const usersAddress = useUsersAddress()
  const sendTx = useSendTransaction()
  const { chainId, walletMatchesNetwork } = useNetwork()
  const { readProvider, isReadProviderReady } = useReadProvider(chainId)

  const [exitFees, setExitFees] = useState({
    earlyExitFee: null,
    credit: null,
    fetched: false
  })
  const debouncedWithdrawAmount = useDebounce(withdrawAmount, 300)

  const ticketDecimals = poolChainValues.ticket.decimals
  const ticketTotalSupply = poolChainValues.ticket.totalSupplyUnformatted
  const numberOfWinners = poolChainValues.config.numberOfWinners
  const poolIsLocked = poolChainValues.prize.isRngRequested
  const tokenDecimals = poolChainValues.token.decimals
  const tokenSymbol = poolChainValues.token.symbol
  const prizePoolAddress = prizePoolContracts.prizePool.address
  const ticketAddress = prizePoolContracts.ticket.address
  const usersTicketBalance = usersChainValues?.usersTicketBalance
  const usersTicketBalanceUnformatted = usersChainValues?.usersTicketBalanceUnformatted
  const { earlyExitFee } = exitFees

  const handleSubmit = (e) => {
    e.preventDefault()

    handleWithdrawInstantly(
      sendTx,
      setTx,
      prizePoolAddress,
      ticketAddress,
      usersAddress,
      withdrawAmount,
      earlyExitFee,
      tokenDecimals
    )
  }

  useEffect(() => {
    const t = async () => {
      if (debouncedWithdrawAmount && isReadProviderReady) {
        const result = await fetchExitFee(
          readProvider,
          usersAddress,
          prizePoolAddress,
          ticketAddress,
          parseNumString(debouncedWithdrawAmount, tokenDecimals)
        )
        setExitFees(result)
      } else {
        setExitFees({
          earlyExitFee: null,
          credit: null,
          fetched: false
        })
      }
    }

    t()
  }, [debouncedWithdrawAmount])

  const withdrawAmountUnformatted = parseNumString(withdrawAmount, tokenDecimals)
  const inputError = !withdrawAmountUnformatted

  const overBalance =
    usersTicketBalanceUnformatted && withdrawAmountUnformatted?.gt(usersTicketBalanceUnformatted)

  const ticketBal = usersTicketBalance

  let usersNewTicketBalance = ethers.constants.Zero
  let totalSupplyLessWithdrawAmountBN = ethers.BigNumber.from(0)
  if (withdrawAmountUnformatted && usersTicketBalanceUnformatted) {
    usersNewTicketBalance = usersTicketBalanceUnformatted.sub(withdrawAmountUnformatted)
    totalSupplyLessWithdrawAmountBN =
      ticketTotalSupply && ticketTotalSupply.sub(withdrawAmountUnformatted)
  }

  const newOdds = calculateOdds(
    usersNewTicketBalance,
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
          This Prize Pool is unable to accept withdrawals at this time.
        </div>
        <div className='text-accent-1'>
          Withdrawals can be made once the prize has been awarded.
        </div>
        <div className='text-accent-1'>Check back soon!</div>
      </InnerCard>
    )
  }

  if (!poolIsLocked && usersTicketBalance && usersTicketBalanceUnformatted.isZero()) {
    return (
      <div className='text-orange-600'>
        You have no deposit to withdraw. Deposit some {tokenSymbol} first!
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
          label='Withdraw amount'
          required
          isError={inputError || overBalance}
          type='number'
          min={min}
          step={step}
          unit={tokenSymbol}
          onChange={(e) => setWithdrawAmount(e.target.value)}
          disabled={!walletMatchesNetwork}
          value={withdrawAmount}
          rightLabel={
            <RightLabelButton
              onClick={(e) => {
                e.preventDefault()
                setWithdrawAmount(ticketBal)
              }}
            >
              {numberWithCommas(usersTicketBalanceUnformatted, { decimals: tokenDecimals })}{' '}
              {tokenSymbol}
            </RightLabelButton>
          }
        />

        {overBalance && (
          <div className='text-xs sm:text-sm text-red-600 sm:ml-4'>
            The maximum you can withdraw is {ticketBal} {tokenSymbol}.
          </div>
        )}

        {inputError && (
          <div className='text-xs sm:text-sm text-red-600 sm:ml-4'>
            The amount you entered is invalid.
          </div>
        )}

        {withdrawAmount && !overBalance && !inputError && (
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
            {/* <WithdrawGauge
              timelockDurationSeconds={timelockDurationSeconds}
              maxTimelockDuration={maxTimelockDuration}
            /> */}

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
  const { walletMatchesNetwork } = useNetwork()

  const { overBalance, resetForm, exitFees, tokenSymbol, tokenDecimals } = props
  const { earlyExitFee, fetched: exitFeesFetched } = exitFees

  if (earlyExitFee && !earlyExitFee.isZero()) {
    return (
      <div className='my-5 flex flex-col sm:flex-row '>
        <Button
          disabled={overBalance || !walletMatchesNetwork}
          color='secondary'
          size='lg'
          fullWidth
          type='button'
          className='mr-4 border-none'
          onClick={(e) => {
            e.preventDefault()
            resetForm()
          }}
        >
          Cancel withdrawal
        </Button>
        <Button
          color='text_warning'
          size='lg'
          disabled={!walletMatchesNetwork}
          fullWidth
          className='ml-0 sm:ml-4 mt-4 sm:mt-0'
        >
          {`Withdraw anyway and pay ${ethers.utils.formatUnits(earlyExitFee, tokenDecimals)}
           ${tokenSymbol}`}
        </Button>
      </div>
    )
  }

  return (
    <div className='my-5 flex flex-col sm:flex-row '>
      <Button
        disabled={overBalance || !exitFeesFetched || !walletMatchesNetwork}
        color='warning'
        size='lg'
      >
        Withdraw
      </Button>
    </div>
  )
}

// const WithdrawGauge = (props) => {
//   const { timelockDurationSeconds, maxTimelockDuration } = props

//   const percentTimeRemaining =
//     timelockDurationSeconds &&
//     maxTimelockDuration &&
//     Math.round((timelockDurationSeconds.toNumber() / maxTimelockDuration.toNumber()) * 100)
//   const { time, timeType } = getTimeLeftDisplayValues(timelockDurationSeconds.toNumber())

//   return (
//     <>
//       <div className='hidden sm:block mr-0 sm:mr-20 ml-0 sm:ml-8' style={{ maxHeight: '240px' }}>
//         <Gauge
//           value={Math.abs(100 - percentTimeRemaining)}
//           label={<GaugeLabel time={time} timeType={timeType} />}
//         />
//       </div>
//       <div className='block sm:hidden text-orange-500 text-center my-2'>
//         {time} more {timeType} to go until free withdrawal
//       </div>
//     </>
//   )
// }

// const getTimeLeftDisplayValues = (secondsLeft) => {
//   const currentDate = new Date(Date.now())
//   const futureDate = addSeconds(currentDate, secondsLeft)
//   const { days, hours, minutes, seconds } = subtractDates(futureDate, currentDate)

//   let time = 0
//   let timeType = ''
//   if (days) {
//     time = days
//     timeType = days === 1 ? 'day' : 'days'
//   } else if (hours) {
//     time = hours
//     timeType = hours === 1 ? 'hour' : 'hours'
//   } else if (minutes) {
//     time = minutes
//     timeType = minutes === 1 ? 'minute' : 'minutes'
//   } else {
//     time = seconds
//     timeType = seconds === 1 ? 'second' : 'seconds'
//   }
//   return { time, timeType }
// }

// const GaugeLabel = (props) => {
//   const { time, timeType } = props

//   return (
//     <div className='flex flex-col'>
//       <div className='text-8xl text-highlight-1 leading-none mt-4 font-bold'>{time}</div>
//       <div className='text-xl text-highlight-1 mb-6 font-bold'>{timeType} left</div>
//       <div className='text-highlight-1 mt-3'>
//         {time} more {timeType} to go until free withdrawal
//       </div>
//     </div>
//   )
// }
