import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useAtom } from 'jotai'
import PrizeStrategyAbi from '@pooltogether/pooltogether-contracts/abis/PeriodicPrizeStrategy'
import FeatherIcon from 'feather-icons-react'
import classnames from 'classnames'

import { erc20AwardsAtom } from 'lib/hooks/useExternalErc20Awards'
import { fetchPoolChainValues, poolChainValuesAtom } from 'lib/hooks/usePoolChainValues'
import { RowDataCell, Table } from 'lib/components/Table'
import { LoadingDots } from 'lib/components/LoadingDots'
import { TextInputGroup } from 'lib/components/TextInputGroup'
import { Card, CardSecondaryText } from 'lib/components/Card'
import { Collapse } from 'lib/components/Collapse'
import { Button } from 'lib/components/Button'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { sendTx } from 'lib/utils/sendTx'
import { poolAddressesAtom } from 'lib/hooks/usePoolAddresses'
import { SENTINEL_ADDRESS } from 'lib/constants'
import { TxMessage } from 'lib/components/TxMessage'
import { contractVersionsAtom, prizePoolTypeAtom } from 'lib/hooks/useDetermineContractVersions'
import { errorStateAtom } from 'lib/components/PoolData'
import { usersAddressAtom } from 'lib/hooks/useUsersAddress'
import { ConnectWalletButton } from 'lib/components/ConnectWalletButton'

const handleAddExternalErc20 = async (
  txName,
  setTx,
  provider,
  prizeStrategyAddress,
  externalErc20
) => {
  const params = [
    externalErc20,
    {
      gasLimit: 200000
    }
  ]

  await sendTx(
    setTx,
    provider,
    prizeStrategyAddress,
    PrizeStrategyAbi,
    'addExternalErc20Award',
    params,
    txName
  )
}

const handleRemoveExternalErc20 = async (
  txName,
  setTx,
  provider,
  prizeStrategyAddress,
  externalErc20,
  prevExternalErc20
) => {
  const params = [
    externalErc20,
    prevExternalErc20,
    {
      gasLimit: 200000
    }
  ]

  await sendTx(
    setTx,
    provider,
    prizeStrategyAddress,
    PrizeStrategyAbi,
    'removeExternalErc20Award',
    params,
    txName
  )
}

export const Erc20AwardsControlCard = (props) => {
  const [poolChainValues] = useAtom(poolChainValuesAtom)
  const [erc20Awards] = useAtom(erc20AwardsAtom)

  return (
    <Card>
      <Collapse title='ERC20 awards'>
        <CardSecondaryText className='mb-8'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea.
        </CardSecondaryText>

        <AwardsTable />

        <AddErc20Form />
      </Collapse>
    </Card>
  )
}

const AwardsTable = () => {
  const [erc20Awards] = useAtom(erc20AwardsAtom)

  const rows = useMemo(
    () =>
      erc20Awards.awards.map((award, index) => {
        return (
          <Row
            key={index}
            award={award}
            prevAddress={index === 0 ? SENTINEL_ADDRESS : erc20Awards.awards[index].address}
          />
        )
      }),
    [erc20Awards.awards]
  )

  if (erc20Awards.loading) {
    return (
      <div className='p-10'>
        <LoadingDots />
      </div>
    )
  }

  if (erc20Awards.awards.length === 0) {
    return null
  }

  return (
    <Table headers={['Value', 'Token name', 'Ticker', '']} rows={rows} className='mb-8 w-full' />
  )
}

const AddErc20Form = () => {
  const [externalErc20Address, setExternalErc20Address] = useState('')
  const [tx, setTx] = useState({})
  const [usersAddress] = useAtom(usersAddressAtom)
  const [poolAddresses] = useAtom(poolAddressesAtom)
  const [prizePoolType] = useAtom(prizePoolTypeAtom)
  const [contractVersions] = useAtom(contractVersionsAtom)
  const [poolChainValues, setPoolChainValues] = useAtom(poolChainValuesAtom)
  const [errorState, setErrorState] = useAtom(errorStateAtom)
  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider

  const txName = 'Add External ERC20 Token'

  const resetState = (e) => {
    e.preventDefault()

    setExternalErc20Address('')
    setTx({})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleAddExternalErc20(
      txName,
      setTx,
      provider,
      poolAddresses.prizeStrategy,
      externalErc20Address
    )
  }

  useEffect(() => {
    if (tx.completed && !tx.error) {
      fetchPoolChainValues(
        provider,
        poolAddresses,
        prizePoolType,
        setPoolChainValues,
        contractVersions.prizeStrategy.contract,
        setErrorState
      )
    }
  }, [tx.completed, tx.error])

  if (!usersAddress) {
    return <ConnectWalletButton />
  }

  if (tx.inWallet || tx.sent || tx.completed) {
    return <TxMessage txType={txName} tx={tx} handleReset={resetState} />
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextInputGroup
        id='newErc20Address'
        name='newErc20Address'
        label='Erc20 token address'
        containerClassName='mb-8'
        placeholder='(eg. 0x1f9840a85d5af5bf1d1762f925bdaddc4201f984)'
        onChange={(e) => {
          setExternalErc20Address(e.target.value)
        }}
        value={externalErc20Address}
      />
      <Button color='secondary' size='lg' disabled={!externalErc20Address}>
        Add ERC20 awardable token
      </Button>
    </form>
  )
}

const Row = (props) => {
  const { prevAddress } = props
  const { formattedBalance, symbol, name, address } = props.award

  return (
    <tr>
      <RowDataCell first className='font-bold'>
        {formattedBalance}
      </RowDataCell>
      <RowDataCell>{name}</RowDataCell>
      <RowDataCell className='text-accent-1'>{symbol}</RowDataCell>
      <RemoveAddressButton address={address} prevAddress={prevAddress} />
    </tr>
  )
}

const RemoveAddressButton = (props) => {
  const { address, prevAddress } = props
  const [tx, setTx] = useState({})
  const [poolAddresses] = useAtom(poolAddressesAtom)
  const [prizePoolType] = useAtom(prizePoolTypeAtom)
  const [usersAddress] = useAtom(usersAddressAtom)
  const [contractVersions] = useAtom(contractVersionsAtom)
  const [poolChainValues, setPoolChainValues] = useAtom(poolChainValuesAtom)
  const [errorState, setErrorState] = useAtom(errorStateAtom)
  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider

  const txName = 'Remove External ERC20 Token'

  const handleSubmit = async (e) => {
    e.preventDefault()
    await handleRemoveExternalErc20(
      txName,
      setTx,
      provider,
      poolAddresses.prizeStrategy,
      address,
      prevAddress
    )
  }

  useEffect(() => {
    if (tx.completed && !tx.error) {
      fetchPoolChainValues(
        provider,
        poolAddresses,
        prizePoolType,
        setPoolChainValues,
        contractVersions.prizeStrategy.contract,
        setErrorState
      )
    }
  }, [tx.completed, tx.error])

  if (!usersAddress) {
    return null
  }

  if (tx.sent && !tx.completed) {
    return <td className='pl-8 text-right flex-grow text-accent-1'>Waiting for confirmations</td>
  }

  if (tx.inWallet && !tx.completed) {
    return (
      <td className='pl-8 text-right flex-grow text-accent-1'>
        Please confirm transaction in your wallet
      </td>
    )
  }

  return (
    <td className='pl-8 text-right flex-grow'>
      <button type='button' onClick={handleSubmit}>
        <FeatherIcon
          icon='x'
          strokeWidth='0.25rem'
          className={classnames(
            'ml-3 sm:ml-4 my-auto w-3 h-3 sm:w-4 sm:h-4 my-auto stroke-current text-red-1 trans hover:opacity-75 active:opacity-50'
          )}
        />
      </button>
    </td>
  )
}
