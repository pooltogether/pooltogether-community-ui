import ComptrollerAbi from '@pooltogether/pooltogether-contracts/abis/Comptroller'
import classnames from 'classnames'
import { ethers } from 'ethers'
import { Button } from 'lib/components/Button'
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

// deactivateBalanceDrip(prizeStrategyAddress, controlledTokenAddress, erc20Address)
// [1, 2, 3, 4, 5]
// if deactivating 3, pass in 2's address for prevDripToken
// or pass SENTINAL_ADDRESS if there are no other drips active
// const SENTINAL = '0x0000000000000000000000000000000000000001'

// activateBalanceDrip(prizeStrategyAddress, controlledTokenAddress, erc20Address, weiPerSecond)
// Decimals: erc20 to give away's decimals
const handleActivateBalanceDripSubmit = async (
  txName,
  setTx,
  provider,
  contractAddress,
  prizeStrategyAddress,
  ticketAddress,
  erc20Address,
  amountPerSecond,
  decimals
) => {
  if (!erc20Address || !amountPerSecond) {
    poolToast.error(
      `ERC20 token address to drip and the amount (in ether) per second needs to be filled in`
    )
    return
  }

  const params = [
    prizeStrategyAddress,
    ticketAddress,
    erc20Address,
    ethers.utils.parseUnits(amountPerSecond, decimals),
    {
      gasLimit: 200000
    }
  ]

  await sendTx(
    setTx,
    provider,
    contractAddress,
    ComptrollerAbi,
    'activateBalanceDrip',
    params,
    txName
  )
}

export const ActivateBalanceDrip = (props) => {
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
  const [amountPerSecond, setAmountPerSecond] = useState('')
  const [tokenChainValues, setTokenChainValues] = useState({})

  const [tx, setTx] = useState({})
  const txInFlight = tx.inWallet || tx.sent

  const resetState = (e) => {
    e.preventDefault()

    setFormVisible(false)
    setErc20TokenAddress('')
    setAmountPerSecond('')

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

  // let amountPerSecondBN
  // let overBalance = false
  // try {
  //   amountPerSecondBN = ethers.utils.parseUnits(amountPerSecond || '0', tokenDecimals)
  //   overBalance = amountPerSecondBN && usersTokenBalance && usersTokenBalance.lt(
  //     amountPerSecondBN
  //   )
  // } catch (e) {
  //   console.error(e)
  // }

  // const tokenBal = ethers.utils.formatUnits(usersTokenBalance, tokenDecimals)
  const txName = 'Activate Balance Drip'

  const handleSubmit = (e) => {
    e.preventDefault()

    handleActivateBalanceDripSubmit(
      txName,
      setTx,
      provider,
      comptrollerAddress,
      prizeStrategyAddress,
      ticketAddress,
      erc20TokenAddress,
      amountPerSecond,
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
        Activate a new balance drip
      </button>

      <div
        className={classnames('trans', {
          hidden: !formVisible
        })}
      >
        <h6 className='mt-8 mb-1'>New balance drip:</h6>

        <form onSubmit={handleSubmit}>
          <div className='flex flex-col sm:flex-row'>
            <div className='sm:w-1/2 sm:pr-4'>
              <div className='w-full mx-auto'>
                <TextInputGroup
                  id='erc20TokenAddress'
                  name='erc20TokenAddress'
                  label={'ERC20 token address to drip'}
                  required
                  onChange={(e) => setErc20TokenAddress(e.target.value)}
                  value={erc20TokenAddress}
                />
              </div>

              <div className='w-full mx-auto'>
                <TextInputGroup
                  id='amountPerSecond'
                  name='amountPerSecond'
                  label={
                    <>
                      Amount per second{' '}
                      <span className='text-default italic'>
                        {' '}
                        {erc20TokenSymbol && <>(in {erc20TokenSymbol})</>}
                      </span>
                    </>
                  }
                  required
                  type='number'
                  pattern='\d+'
                  onChange={(e) => setAmountPerSecond(e.target.value)}
                  value={amountPerSecond}
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
                        <div
                          className={classnames('uppercase text-default', {
                            'text-red': erc20TokenBalance?.eq(0)
                          })}
                        >
                          Comptroller's balance:
                        </div>{' '}
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
