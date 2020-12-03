import ComptrollerAbi from '@pooltogether/pooltogether-contracts/abis/Comptroller'
import classnames from 'classnames'
import { ethers } from 'ethers'
import { Button } from 'lib/components/Button'
import { CheckboxInputGroup } from 'lib/components/CheckboxInputGroup'
import { LoadingDots } from 'lib/components/LoadingDots'
import { TextInputGroup } from 'lib/components/TextInputGroup'
import { TxMessage } from 'lib/components/TxMessage'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { fetchTokenChainData } from 'lib/utils/fetchTokenChainData'
import { poolToast } from 'lib/utils/poolToast'
import { sendTx } from 'lib/utils/sendTx'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'

const handleActivateVolumeDripSubmit = async (
  txName,
  setTx,
  provider,
  contractAddress,
  prizeStrategyAddress,
  ticketAddress,
  erc20Address,
  isReferral,
  periodSeconds,
  dripAmount,
  endTime,
  decimals
) => {
  if (!erc20Address || !periodSeconds || !dripAmount) {
    poolToast.error(`Please make sure all form fields are filled in`)
    return
  }

  if (!endTime) {
    endTime = parseInt(periodSeconds, 10) + parseInt(Date.now() / 1000, 10)
  }

  const params = [
    prizeStrategyAddress,
    ticketAddress,
    erc20Address,
    isReferral,
    periodSeconds,
    ethers.utils.parseUnits(dripAmount, decimals),
    endTime,
    {
      gasLimit: 200000
    }
  ]

  await sendTx(
    setTx,
    provider,
    contractAddress,
    ComptrollerAbi,
    'activateVolumeDrip',
    params,
    txName
  )
}

export const ActivateVolumeDrip = (props) => {
  const {
    poolChainValues
    // adminChainValues, ?
  } = props

  const router = useRouter()
  const networkName = router.query.networkName

  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider
  const comptrollerAddress = props?.poolAddresses?.tokenListener
  const ticketAddress = props?.poolAddresses?.ticket
  const prizeStrategyAddress = props?.poolAddresses?.prizeStrategy

  const [formVisible, setFormVisible] = useState(false)
  const [erc20TokenAddress, setErc20TokenAddress] = useState('')
  const [isReferral, setIsReferral] = useState('')
  const [periodSeconds, setPeriodSeconds] = useState('')
  const [dripAmount, setDripAmount] = useState('')
  const [endTime, setEndTime] = useState('')
  const [tokenChainValues, setTokenChainValues] = useState({})

  const [tx, setTx] = useState({})
  const txInFlight = tx.inWallet || tx.sent

  const resetState = (e) => {
    e.preventDefault()

    setFormVisible(false)
    setErc20TokenAddress('')

    setTx({})
  }

  useEffect(() => {
    const fetchToken = async () => {
      setTokenChainValues({ loading: true })

      const tokenChainValues = await fetchTokenChainData(
        networkName,
        comptrollerAddress,
        erc20TokenAddress
      )

      setTokenChainValues(tokenChainValues)
    }

    try {
      ethers.utils.getAddress(erc20TokenAddress)

      fetchToken()
    } catch (e) {
      setTokenChainValues({})
    }
  }, [erc20TokenAddress])

  const erc20DetailsLoading = tokenChainValues?.loading
  const erc20TokenName = tokenChainValues?.tokenName
  const erc20TokenSymbol = tokenChainValues?.tokenSymbol
  const erc20TokenDecimals = tokenChainValues?.tokenDecimals
  const erc20TokenBalance = tokenChainValues?.tokenBalanceOf

  const txName = 'Activate Volume Drip'

  const handleSubmit = (e) => {
    e.preventDefault()

    handleActivateVolumeDripSubmit(
      txName,
      setTx,
      provider,
      comptrollerAddress,
      prizeStrategyAddress,
      ticketAddress,
      erc20TokenAddress,
      isReferral,
      periodSeconds,
      dripAmount,
      endTime,
      erc20TokenDecimals
    )
  }

  if (txInFlight || tx.completed) {
    return <TxMessage txType={txName} tx={tx} handleReset={resetState} />
  }

  return (
    <>
      <button
        type='button'
        onClick={(e) => {
          e.preventDefault()

          setFormVisible(true)
        }}
        className={classnames('mt-4 mb-1 text-green font-bold trans', {
          hidden: formVisible
        })}
      >
        Activate a new volume drip
      </button>

      <div
        className={classnames('trans', {
          hidden: !formVisible
        })}
      >
        <h6 className='mt-8 mb-1'>New volume drip:</h6>

        <form onSubmit={handleSubmit}>
          <div className='flex flex-col sm:flex-row'>
            <div className='sm:w-1/2 sm:pr-4'>
              <div className='w-full mx-auto'>
                <TextInputGroup
                  id='erc20TokenAddress'
                  name='erc20TokenAddress'
                  label={<>ERC20 token address to drip</>}
                  required
                  onChange={(e) => setErc20TokenAddress(e.target.value)}
                  value={erc20TokenAddress}
                />
              </div>

              <div className='w-full mx-auto'>
                <TextInputGroup
                  id='periodSeconds'
                  name='periodSeconds'
                  label={
                    <>
                      Drip period <span className='text-default italic'>(in seconds)</span>
                    </>
                  }
                  required
                  type='number'
                  pattern='\d+'
                  onChange={(e) => setPeriodSeconds(e.target.value)}
                  value={periodSeconds}
                />
              </div>

              <div className='w-full mx-auto'>
                <TextInputGroup
                  id='dripAmount'
                  name='dripAmount'
                  label={
                    <>
                      Drip amount{' '}
                      <span className='text-default italic'>
                        {' '}
                        (this is the total you will drip during the period{' '}
                        {erc20TokenSymbol && <>in {erc20TokenSymbol}</>})
                      </span>
                    </>
                  }
                  required
                  type='number'
                  pattern='\d+'
                  onChange={(e) => setDripAmount(e.target.value)}
                  value={dripAmount}
                />
              </div>

              <div className='w-full mx-auto'>
                <TextInputGroup
                  id='endTime'
                  name='endTime'
                  label={
                    <>
                      End time{' '}
                      <span className='text-default italic'>
                        (in unix timestamp, leave blank for 'now + drip period')
                      </span>
                    </>
                  }
                  type='number'
                  pattern='\d+'
                  onChange={(e) => setEndTime(e.target.value)}
                  value={endTime}
                />
              </div>

              <div className='w-full mx-auto'>
                <CheckboxInputGroup
                  large
                  id='isReferral'
                  name='isReferral'
                  label='Is referral volume?'
                  title={'Is referral volume?'}
                  checked={isReferral}
                  handleClick={(e) => {
                    e.preventDefault()

                    setIsReferral(!isReferral)
                  }}
                />
              </div>
            </div>

            <div className='w-full sm:w-1/2 my-2 sm:my-0 sm:pl-4'>
              <div className='font-bold text-xs mb-1'>Token details:</div>

              <div
                className='flex flex-col w-full bg-primary rounded-lg py-2'
                style={{ minHeight: 70 }}
              >
                {erc20DetailsLoading && <LoadingDots />}
                {erc20TokenName && (
                  <>
                    <div className='text-sm font-bold'>
                      <div className='px-4 pt-1 pb-1'>
                        <div className='uppercase text-default'>Name:</div> {erc20TokenName}
                      </div>
                      <div className='px-4 pt-1 pb-1'>
                        <div className='uppercase text-default'>Symbol:</div> {erc20TokenSymbol}
                      </div>
                      <div className='px-4 pt-1 pb-1'>
                        <div className={'uppercase text-default'}>Comptroller's balance:</div>{' '}
                        <span
                          className={classnames({
                            'text-red': erc20TokenBalance?.eq(0)
                          })}
                        >
                          {displayAmountInEther(erc20TokenBalance, {
                            precision: 4,
                            decimals: erc20TokenDecimals
                          })}
                        </span>
                        <div className='text-default-soft mt-2'>
                          <span className='text-default'>INSTRUCTIONS:</span> Send enough of the
                          ERC20 token to be dripped out by the Comptroller at: {comptrollerAddress}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <Button
            disabled={!erc20TokenName || erc20TokenBalance?.eq(0)}
            className='mt-2'
            paddingClasses='py-2'
            size='sm'
            color='green'
          >
            Activate
          </Button>
        </form>
      </div>
    </>
  )
}
