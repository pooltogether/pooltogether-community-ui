import React, { useContext } from 'react'

import { Card, CardPrimaryText, CardSecondaryText, CardSecondaryTitle } from 'lib/components/Card'
import { usePoolChainValues } from 'lib/hooks/usePoolChainValues'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { WALLETS } from 'lib/constants'
import { Button } from 'lib/components/Button'
import { useUsersAddress } from 'lib/hooks/useUsersAddress'

export const TicketCards = (props) => {
  const { data: poolChainValues } = usePoolChainValues()
  const usersAddress = useUsersAddress()
  const wallet = useContext(WalletContext)
  const walletName = wallet?.state?.wallet?.name
  const showAddButton = [WALLETS.metamask].includes(walletName) && Boolean(usersAddress)

  return (
    <div className='flex flex-col xs:flex-row'>
      <TicketCard poolChainValues={poolChainValues} showAddButton={showAddButton} />
      <SponsorshipCard poolChainValues={poolChainValues} showAddButton={showAddButton} />
    </div>
  )
}

const TicketCard = (props) => {
  const { showAddButton, poolChainValues } = props
  const { symbol, address, decimals, name } = poolChainValues.ticket

  return (
    <Card className='mr-1 sm:mr-4 flex flex-col'>
      <CardSecondaryTitle>Ticket symbol & name</CardSecondaryTitle>
      <CardPrimaryText>{`$${symbol}`}</CardPrimaryText>
      <CardSecondaryText className='text-center'>{name}</CardSecondaryText>
      {showAddButton && (
        <Button
          color='tertiary'
          className='mx-auto mt-4'
          onClick={() => addTokenToMetaMask(address, symbol, decimals)}
        >
          Add {`${symbol}`} to MetaMask
        </Button>
      )}
    </Card>
  )
}
const SponsorshipCard = (props) => {
  const { showAddButton, poolChainValues } = props
  const { symbol, address, decimals, name } = poolChainValues.sponsorship

  return (
    <Card className='ml-1 sm:ml-4 flex flex-col'>
      <CardSecondaryTitle>Sponsorship symbol & name</CardSecondaryTitle>
      <CardPrimaryText>{`$${symbol}`}</CardPrimaryText>
      <CardSecondaryText className='text-center'>{name}</CardSecondaryText>
      {showAddButton && (
        <Button
          color='tertiary'
          className='mx-auto mt-4'
          onClick={() => addTokenToMetaMask(address, symbol, decimals)}
        >
          Add {`${symbol}`} to MetaMask
        </Button>
      )}
    </Card>
  )
}

const addTokenToMetaMask = async (tokenAddress, symbol, decimals) => {
  try {
    const wasAdded = await ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: tokenAddress,
          symbol, // A ticker symbol or shorthand, up to 5 chars.
          decimals, // The number of decimals in the token
          image: 'https://app.pooltogether.com/pooltogether-token-logo@2x.png'
        }
      }
    })

    if (wasAdded) {
      poolToast.success(t('successfullyAddedTokenToMetaMask', { token: symbol }))
    }
  } catch (error) {
    console.error(error)
  }
}
function AuthControllerContext(AuthControllerContext) {
  throw new Error('Function not implemented.')
}
