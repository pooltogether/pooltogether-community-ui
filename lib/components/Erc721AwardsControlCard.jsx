import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useAtom } from 'jotai'
import PrizeStrategyAbi from '@pooltogether/pooltogether-contracts/abis/PeriodicPrizeStrategy'
import FeatherIcon from 'feather-icons-react'
import classnames from 'classnames'

import { fetchPoolChainValues, poolChainValuesAtom } from 'lib/hooks/usePoolChainValues'
import { RowDataCell, Table } from 'lib/components/Table'
import { LoadingDots } from 'lib/components/LoadingDots'
import { TextInputGroup } from 'lib/components/TextInputGroup'
import { Card, CardSecondaryText, InnerCard } from 'lib/components/Card'
import { Collapse } from 'lib/components/Collapse'
import { Button } from 'lib/components/Button'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { sendTx } from 'lib/utils/sendTx'
import { poolAddressesAtom } from 'lib/hooks/usePoolAddresses'
import { SENTINEL_ADDRESS } from 'lib/constants'
import { TxMessage } from 'lib/components/TxMessage'
import { contractVersionsAtom, prizePoolTypeAtom } from 'lib/hooks/useDetermineContractVersions'
import { errorStateAtom } from 'lib/components/PoolData'
import { erc721AwardsAtom } from 'lib/hooks/useExternalErc721Awards'
import { usersAddressAtom } from 'lib/hooks/useUsersAddress'
import { ConnectWalletButton } from 'lib/components/ConnectWalletButton'

import PrizeIllustration from 'assets/images/prize-illustration-transparent@2x.png'

const handleAddExternalErc721 = async (
  txName,
  setTx,
  provider,
  prizeStrategyAddress,
  externalErc721Address,
  tokenIds
) => {
  const params = [
    externalErc721Address,
    tokenIds,
    {
      gasLimit: 200000
    }
  ]

  await sendTx(
    setTx,
    provider,
    prizeStrategyAddress,
    PrizeStrategyAbi,
    'addExternalErc721Award',
    params,
    txName
  )
}

const handleRemoveExternalErc721 = async (
  txName,
  setTx,
  provider,
  prizeStrategyAddress,
  externalErc721Address,
  prevExternalErc721Address
) => {
  const params = [
    externalErc721Address,
    prevExternalErc721Address,
    {
      gasLimit: 200000
    }
  ]

  await sendTx(
    setTx,
    provider,
    prizeStrategyAddress,
    PrizeStrategyAbi,
    'removeExternalErc721Award',
    params,
    txName
  )
}

export const Erc721AwardsControlCard = (props) => {
  return (
    <Card>
      <Collapse title='ERC721 awards'>
        <AwardsTable />

        <AddErc721Form />
      </Collapse>
    </Card>
  )
}

const AwardsTable = () => {
  const [erc721Awards] = useAtom(erc721AwardsAtom)

  const rows = useMemo(
    () =>
      erc721Awards.awards
        .map((award, index) => {
          return award.tokenIds[0].map((tokenId) => {
            return (
              <Row
                key={`${index}${tokenId.toString()}`}
                address={award.address}
                tokenId={tokenId}
                prevAddress={index === 0 ? SENTINEL_ADDRESS : erc721Awards.awards[index].address}
              />
            )
          })
        })
        .flat(),
    [erc721Awards.awards]
  )

  if (erc721Awards.loading) {
    return (
      <div className='p-10'>
        <LoadingDots />
      </div>
    )
  }

  if (erc721Awards.awards.length === 0) {
    return (
      <InnerCard className='mb-8'>
        <img src={PrizeIllustration} className='w-32 sm:w-64 mx-auto mb-4' />
        <span className='text-accent-1 text-center text-base sm:text-xl'>
          Oh no, there are no external prizes yet!
        </span>
      </InnerCard>
    )
  }

  return <Table headers={['Token id', 'Token address', '']} rows={rows} className='mb-8 w-full' />
}

const AddErc721Form = () => {
  const [externalErc721Address, setExternalErc721Address] = useState('')
  const [externalErc721TokenIds, setExternalErc721TokenIds] = useState('')
  const [tx, setTx] = useState({})
  const [poolAddresses] = useAtom(poolAddressesAtom)
  const [prizePoolType] = useAtom(prizePoolTypeAtom)
  const [usersAddress] = useAtom(usersAddressAtom)
  const [contractVersions] = useAtom(contractVersionsAtom)
  const [poolChainValues, setPoolChainValues] = useAtom(poolChainValuesAtom)
  const [errorState, setErrorState] = useAtom(errorStateAtom)
  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider

  const txName = 'Add External ERC721 Tokens'

  const resetState = (e) => {
    e.preventDefault()

    setExternalErc721Address('')
    setExternalErc721TokenIds('')
    setTx({})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleAddExternalErc721(
      txName,
      setTx,
      provider,
      poolAddresses.prizeStrategy,
      externalErc721Address,
      externalErc721TokenIds.split(',').map((s) => s.trim())
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

  const txInFlight = tx.inWallet || tx.sent
  if (txInFlight || tx.completed) {
    return <TxMessage txType={txName} tx={tx} handleReset={resetState} />
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextInputGroup
        id='newErc721Address'
        name='newErc721Address'
        label='Erc721 token address'
        containerClassName='mb-8'
        placeholder='(eg. 0x1f9840a85d5af5bf1d1762f925bdaddc4201f984)'
        onChange={(e) => {
          setExternalErc721Address(e.target.value)
        }}
        value={externalErc721Address}
      />
      <TextInputGroup
        id='erc721TokenIds'
        name='erc721TokenIds'
        label='Erc721 token ids'
        containerClassName='mb-8'
        placeholder='1167158, 1167159'
        onChange={(e) => {
          setExternalErc721TokenIds(e.target.value)
        }}
        value={externalErc721TokenIds}
      />
      <Button
        color='secondary'
        size='lg'
        disabled={!externalErc721Address || !externalErc721TokenIds}
      >
        Add ERC71 award
      </Button>
    </form>
  )
}

const Row = (props) => {
  const { tokenId, address, prevAddress } = props

  return (
    <tr>
      <RowDataCell first className='font-bold'>
        {tokenId.toString()}
      </RowDataCell>
      <RowDataCell className='text-accent-1'>{address}</RowDataCell>
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
    await handleRemoveExternalErc721(
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
