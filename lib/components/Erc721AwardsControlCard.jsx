import React, { useMemo, useState } from 'react'
import PrizeStrategyAbi from '@pooltogether/pooltogether-contracts/abis/PeriodicPrizeStrategy'
import FeatherIcon from 'feather-icons-react'
import classnames from 'classnames'

import { SENTINEL_ADDRESS } from 'lib/constants'
import { RowDataCell, Table } from 'lib/components/Table'
import { LoadingDots } from 'lib/components/LoadingDots'
import { TextInputGroup } from 'lib/components/TextInputGroup'
import { Card, InnerCard } from 'lib/components/Card'
import { Collapse } from 'lib/components/Collapse'
import { Button } from 'lib/components/Button'
import { TxMessage } from 'lib/components/TxMessage'
import { ConnectWalletButton } from 'lib/components/ConnectWalletButton'
import { CopyableAddress } from 'lib/components/CopyableAddress'
import { BlockExplorerLink } from 'lib/components/BlockExplorerLink'
import { useNetwork } from 'lib/hooks/useNetwork'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { usePrizePoolContracts } from 'lib/hooks/usePrizePoolContracts'
import { useExternalErc721Awards } from 'lib/hooks/useExternalErc721Awards'
import { usePoolChainValues } from 'lib/hooks/usePoolChainValues'
import { useUsersAddress } from '@pooltogether/hooks'
import { useOnTransactionCompleted } from 'lib/hooks/useOnTransactionCompleted'

import PrizeIllustration from 'assets/images/prize-illustration-transparent@2x.png'

const handleAddExternalErc721 = async (
  sendTx,
  txName,
  setTx,
  prizeStrategyAddress,
  externalErc721Address,
  tokenIds
) => {
  const params = [externalErc721Address, tokenIds]

  await sendTx(
    setTx,
    prizeStrategyAddress,
    PrizeStrategyAbi,
    'addExternalErc721Award',
    txName,
    params
  )
}

const handleRemoveExternalErc721 = async (
  sendTx,
  txName,
  setTx,
  prizeStrategyAddress,
  externalErc721Address,
  prevExternalErc721Address
) => {
  const params = [externalErc721Address, prevExternalErc721Address]

  await sendTx(
    setTx,
    prizeStrategyAddress,
    PrizeStrategyAbi,
    'removeExternalErc721Award',
    txName,
    params
  )
}

export const Erc721AwardsControlCard = (props) => {
  return (
    <Card>
      <Collapse title='External ERC721 awards'>
        <AwardsTable />

        <AddErc721Form />
      </Collapse>
    </Card>
  )
}

const AwardsTable = () => {
  const { data: erc721Awards, isFetched: erc721AwardsIsFetched } = useExternalErc721Awards()

  const rows = useMemo(
    () =>
      erc721Awards
        .map((award, index) => {
          return award.tokenIds[0].map((tokenId) => {
            return (
              <Row
                key={`${index}${tokenId.toString()}`}
                address={award.address}
                tokenId={tokenId}
                prevAddress={index === 0 ? SENTINEL_ADDRESS : erc721Awards[index].address}
              />
            )
          })
        })
        .flat(),
    [erc721Awards]
  )

  if (!erc721AwardsIsFetched) {
    return (
      <div className='p-10'>
        <LoadingDots />
      </div>
    )
  }

  if (erc721Awards.length === 0) {
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
  const usersAddress = useUsersAddress()
  const { data: prizePoolContracts } = usePrizePoolContracts()
  const { refetch: refetchPoolChainValues } = usePoolChainValues()
  const { walletMatchesNetwork } = useNetwork()
  const sendTx = useSendTransaction()

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
      sendTx,
      txName,
      setTx,
      prizePoolContracts.prizeStrategy.address,
      externalErc721Address,
      externalErc721TokenIds.split(',').map((s) => s.trim())
    )
  }

  useOnTransactionCompleted(tx, refetchPoolChainValues)

  if (!usersAddress) {
    return <ConnectWalletButton className='w-full mt-4' />
  }

  const txInFlight = tx.inWallet || tx.sent
  if (txInFlight || tx.completed) {
    return <TxMessage txType={txName} tx={tx} handleReset={resetState} />
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className='mb-4 text-sm sm:text-base font-bold opacity-80'>
        Follow the steps below to add prizes to the pool:{' '}
      </div>
      <div className='my-4 text-sm sm:text-base text-accent-1'>
        1. Send the ERC721 token manually to the contract address below.
      </div>
      <CopyableAddress
        className='ml-4 my-4 text-lg sm:text-xl'
        address={prizePoolContracts.prizePool.address}
      />
      <div className='mb-6 text-sm sm:text-base text-accent-1'>
        2. Add the ERC721 token contract address and the token ID to the external awards
        distribution list below.
      </div>

      <TextInputGroup
        id='newErc721Address'
        name='newErc721Address'
        label='ERC721 token address'
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
        label='ERC721 token ids'
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
        disabled={!externalErc721Address || !externalErc721TokenIds || !walletMatchesNetwork}
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
      <RowDataCell className='text-accent-1'>
        <BlockExplorerLink address={address} />
      </RowDataCell>
      <RemoveAddressButton address={address} prevAddress={prevAddress} />
    </tr>
  )
}

const RemoveAddressButton = (props) => {
  const { address, prevAddress } = props
  const [tx, setTx] = useState({})

  const { data: prizePoolContracts } = usePrizePoolContracts()
  const usersAddress = useUsersAddress()
  const { refetch: refetchPoolChainValues } = usePoolChainValues()
  const sendTx = useSendTransaction()

  const txName = 'Remove External ERC20 Token'

  const handleSubmit = async (e) => {
    e.preventDefault()
    await handleRemoveExternalErc721(
      sendTx,
      txName,
      setTx,
      prizePoolContracts.prizeStrategy.address,
      address,
      prevAddress
    )
  }

  useOnTransactionCompleted(tx, refetchPoolChainValues)

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
            'ml-3 sm:ml-4 w-3 h-3 sm:w-4 sm:h-4 my-auto stroke-current text-red-1 trans hover:opacity-75 active:opacity-50'
          )}
        />
      </button>
    </td>
  )
}
