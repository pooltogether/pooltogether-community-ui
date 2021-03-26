import { ethers } from 'ethers'
import { batch, contract } from '@pooltogether/etherplex'

import {
  CONTRACTS,
  CONTRACT_ADDRESSES,
  DATA_REFRESH_POLLING_INTERVAL,
  DEFAULT_TOKEN_PRECISION,
  PRIZE_POOL_TYPE,
  QUERY_KEYS,
  SECONDS_PER_BLOCK
} from 'lib/constants'
import { useReadProvider } from 'lib/hooks/useReadProvider'
import { calculateSablierPrize } from 'lib/utils/calculateSablierPrize'
import { useNetwork } from 'lib/hooks/useNetwork'

import SablierAbi from 'abis/SablierAbi'
import ERC20Abi from 'abis/ERC20Abi'
import CTokenAbi from '@pooltogether/pooltogether-contracts/abis/CTokenInterface'
import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'
import SablierManagerAbi from '@pooltogether/pooltogether-contracts/abis/SablierManager'
import MultipleWinnersPrizeStrategyAbi from '@pooltogether/pooltogether-contracts/abis/MultipleWinners'
import SingleRandomWinnerPrizeStrategyAbi from '@pooltogether/pooltogether-contracts/abis/SingleRandomWinner'
import { usePrizePoolContracts } from 'lib/hooks/usePrizePoolContracts'
import { useQuery } from 'react-query'
import { usePrizePoolType } from 'lib/hooks/usePrizePoolType'

export const usePoolChainValues = () => {
  const {
    data: prizePoolContracts,
    isFetched: prizePoolContractsIsFetched
  } = usePrizePoolContracts()
  const prizePoolType = usePrizePoolType()
  const { readProvider: provider, isLoaded: readProviderLoaded } = useReadProvider()
  const { chainId } = useNetwork()

  const enabled = prizePoolContractsIsFetched && readProviderLoaded

  return useQuery(
    [QUERY_KEYS.fetchPoolChainData, chainId, prizePoolContracts?.prizePool?.address],
    async (a, b, c, d) =>
      await _fetchPoolChainValues(provider, chainId, prizePoolContracts, prizePoolType),
    {
      enabled,
      refetchInterval: DATA_REFRESH_POLLING_INTERVAL,
      staleTime: DATA_REFRESH_POLLING_INTERVAL,
      placeholderData: { ...EMPTY_POOL_CHAIN_VALUES }
    }
  )
}

export const _fetchPoolChainValues = async (
  provider,
  chainId,
  prizePoolContracts,
  prizePoolType
) => {
  const prizeStrategyAddress = prizePoolContracts.prizeStrategy.address
  const ticketAddress = prizePoolContracts.ticket.address
  const sponsorshipAddress = prizePoolContracts.sponsorship.address
  const tokenAddress = prizePoolContracts.token.address

  const prizePoolAddress = prizePoolContracts.prizePool.address
  const beforeAwardListenerAddress = prizePoolContracts?.beforeAwardListener?.address

  try {
    const prizeStrategyRequests = getPrizeStrategyRequests(
      prizeStrategyAddress,
      prizePoolContracts.prizeStrategy.contract
    )
    const etherplexTicketContract = contract('ticket', ERC20Abi, ticketAddress)
    const etherplexSponsorshipContract = contract('sponsorship', ERC20Abi, sponsorshipAddress)
    const etherplexTokenContract = contract('token', ERC20Abi, tokenAddress)
    const etherplexPrizePoolContract = contract('prizePool', PrizePoolAbi, prizePoolAddress)

    const batchRequests = [
      prizeStrategyRequests,
      etherplexTicketContract.name().symbol().totalSupply().decimals(),
      etherplexSponsorshipContract.name().symbol().totalSupply(),
      etherplexTokenContract.decimals().symbol().name(),
      etherplexPrizePoolContract
        .captureAwardBalance()
        .creditPlanOf(ticketAddress)
        .maxExitFeeMantissa()
        .maxTimelockDuration()
        .owner()
    ]

    if (prizePoolType === PRIZE_POOL_TYPE.compound) {
      const cTokenAddress = prizePoolContracts.cToken.address
      const etherplexCTokenContract = contract('cToken', CTokenAbi, cTokenAddress)
      batchRequests.push(etherplexCTokenContract.supplyRatePerBlock())
    }

    const { prizePool, prizeStrategy, sponsorship, ticket, token, cToken } = await batch(
      provider,
      ...batchRequests
    )

    let sablierStream = null
    if (beforeAwardListenerAddress) {
      sablierStream = await _fetchSablierStreamChainValues(
        provider,
        chainId,
        beforeAwardListenerAddress,
        prizePool,
        {
          prizePeriodStartedAt: prizeStrategy.prizePeriodStartedAt[0],
          prizePeriodSeconds: prizeStrategy.prizePeriodSeconds[0],
          isRngRequested: prizeStrategy.isRngRequested[0]
        }
      )
    }

    return formatChainData(
      prizePoolContracts,
      prizePool,
      prizeStrategy,
      sponsorship,
      ticket,
      token,
      cToken,
      sablierStream
    )
  } catch (e) {
    console.error(e)
    return { ...EMPTY_POOL_CHAIN_VALUES }
  }
}

const _fetchSablierStreamChainValues = async (
  provider,
  chainId,
  sablierManagerAddress,
  prizePoolAddress,
  prizeStrategyData
) => {
  try {
    const sablierManagerContract = contract(
      'sablierManager',
      SablierManagerAbi,
      sablierManagerAddress
    )
    const { sablierManager } = await batch(
      provider,
      sablierManagerContract.sablierStreamId(prizePoolAddress)
    )
    const streamId = sablierManager.sablierStreamId[0]

    const sablierContract = contract('sablier', SablierAbi, CONTRACT_ADDRESSES[chainId].Sablier)
    const sablierValues = await batch(provider, sablierContract.getStream(streamId))

    const tokenAddress = sablierValues.sablier.getStream.tokenAddress
    const startTime = sablierValues.sablier.getStream.startTime
    const stopTime = sablierValues.sablier.getStream.stopTime
    const ratePerSecond = sablierValues.sablier.getStream.ratePerSecond
    const deposit = sablierValues.sablier.getStream.deposit

    const tokenContract = contract('sablierToken', ERC20Abi, tokenAddress)
    const tokenValues = await batch(provider, tokenContract.decimals().symbol().name())

    const { amountThisPrizePeriod, amountPerPrizePeriod } = calculateSablierPrize(
      {
        startTime,
        stopTime,
        ratePerSecond
      },
      prizeStrategyData
    )

    const tokenDecimals = tokenValues.sablierToken.decimals[0]

    return {
      id: streamId.toNumber(),
      idBN: streamId,
      amount: ethers.utils.formatUnits(amountThisPrizePeriod, tokenDecimals),
      amountUnformatted: amountThisPrizePeriod,
      amountPerPrizePeriod: ethers.utils.formatUnits(amountPerPrizePeriod, tokenDecimals),
      amountPerPrizePeriodUnformatted: amountPerPrizePeriod,
      tokenName: tokenValues.sablierToken.name[0],
      tokenSymbol: tokenValues.sablierToken.symbol[0],
      totalDeposit: ethers.utils.formatUnits(deposit, tokenDecimals),
      totalDepositUnformatted: deposit,
      tokenDecimals,
      tokenAddress,
      startTime,
      stopTime,
      ratePerSecond
    }
  } catch (e) {
    console.warn(e)
    return null
  }
}

const getPrizeStrategyRequests = (prizeStrategyAddress, contractType) => {
  switch (contractType) {
    case CONTRACTS.singleRandomWinner: {
      const etherplexPrizeStrategyContract = contract(
        'prizeStrategy',
        SingleRandomWinnerPrizeStrategyAbi,
        prizeStrategyAddress
      )
      return etherplexPrizeStrategyContract
        .isRngRequested() // used to determine if the pool is locked
        .prizePeriodStartedAt()
        .prizePeriodSeconds()
        .isRngTimedOut()
        .canStartAward()
        .canCompleteAward()
        .prizePeriodRemainingSeconds()
        .getExternalErc20Awards()
        .getExternalErc721Awards()
    }
    case CONTRACTS.multipleWinners:
    default: {
      const etherplexPrizeStrategyContract = contract(
        'prizeStrategy',
        MultipleWinnersPrizeStrategyAbi,
        prizeStrategyAddress
      )
      return etherplexPrizeStrategyContract
        .isRngRequested()
        .prizePeriodStartedAt()
        .prizePeriodSeconds()
        .isRngTimedOut()
        .canStartAward()
        .canCompleteAward()
        .prizePeriodRemainingSeconds()
        .getExternalErc20Awards()
        .getExternalErc721Awards()
        .numberOfWinners()
    }
  }
}

const formatChainData = (
  prizePoolContracts,
  prizePool,
  prizeStrategy,
  sponsorship,
  ticket,
  token,
  cToken,
  sablierStream
) => {
  return {
    config: {
      numberOfWinners: prizeStrategy?.numberOfWinners?.[0]?.toNumber() || 1,
      maxTimelockDuration: prizePool.maxTimelockDuration[0],
      ticketCreditRateMantissa: prizePool.creditPlanOf.creditRateMantissa,
      ticketCreditLimitMantissa: prizePool.creditPlanOf.creditLimitMantissa,
      maxExitFeeMantissa: prizePool.maxExitFeeMantissa[0],
      owner: prizePool.owner[0]
    },
    prize: {
      canStartAward: prizeStrategy.canStartAward[0],
      canCompleteAward: prizeStrategy.canCompleteAward[0],
      externalErc20Awards: prizeStrategy.getExternalErc20Awards[0],
      externalErc721Awards: prizeStrategy.getExternalErc721Awards[0],
      isRngTimedOut: prizeStrategy.isRngTimedOut[0],
      prizePeriodRemainingSeconds: prizeStrategy.prizePeriodRemainingSeconds[0],
      isRngRequested: prizeStrategy.isRngRequested[0],
      prizePeriodSeconds: prizeStrategy.prizePeriodSeconds[0],
      supplyRatePerBlock: cToken?.supplyRatePerBlock[0],
      awardBalance: prizePool.captureAwardBalance[0],
      sablierStream: {
        id: sablierStream?.id,
        idBN: sablierStream?.idBN,
        amount: sablierStream?.amount,
        amountUnformatted: sablierStream?.amountUnformatted,
        amountPerPrizePeriod: sablierStream?.amountPerPrizePeriod,
        amountPerPrizePeriodUnformatted: sablierStream?.amountPerPrizePeriodUnformatted,
        tokenName: sablierStream?.tokenName,
        tokenSymbol: sablierStream?.tokenSymbol,
        totalDeposit: sablierStream?.totalDeposit,
        totalDepositUnformatted: sablierStream?.totalDepositUnformatted,
        tokenDecimals: sablierStream?.tokenDecimals,
        tokenAddress: sablierStream?.tokenAddress,
        startTime: sablierStream?.startTime,
        stopTime: sablierStream?.stopTime,
        ratePerSecond: sablierStream?.ratePerSecond
      }
    },
    sponsorship: {
      address: prizePoolContracts.sponsorship.address,
      decimals: ticket.decimals[0] || DEFAULT_TOKEN_PRECISION,
      name: sponsorship.name[0] || 'TOKEN',
      symbol: sponsorship.symbol[0] || 'TOKEN',
      totalSupply: ethers.utils.formatUnits(
        sponsorship.totalSupply[0],
        ticket.decimals[0] || DEFAULT_TOKEN_PRECISION
      ),
      totalSupplyUnformatted: sponsorship.totalSupply[0]
    },
    ticket: {
      address: prizePoolContracts.ticket.address,
      decimals: ticket.decimals[0] || DEFAULT_TOKEN_PRECISION,
      name: ticket.name[0] || 'TOKEN',
      symbol: ticket.symbol[0] || 'TOKEN',
      totalSupplyUnformatted: ticket.totalSupply[0],
      totalSupply: ethers.utils.formatUnits(
        ticket.totalSupply[0],
        ticket.decimals[0] || DEFAULT_TOKEN_PRECISION
      )
    },
    token: {
      address: prizePoolContracts.token.address,
      decimals: token.decimals[0] || DEFAULT_TOKEN_PRECISION,
      name: token.name[0] || 'TOKEN',
      symbol: token.symbol[0] || 'TOKEN'
    },
    totalSupplyUnformatted: ticket.totalSupply[0].add(sponsorship.totalSupply[0]),
    totalSupply: ethers.utils.formatUnits(
      ticket.totalSupply[0].add(sponsorship.totalSupply[0]),
      ticket.decimals[0] || DEFAULT_TOKEN_PRECISION
    )
  }
}

// This is mostly for typing in VSCode
const EMPTY_POOL_CHAIN_VALUES = Object.freeze({
  config: {
    numberOfWinners: null,
    maxTimelockDuration: null,
    ticketCreditRateMantissa: null,
    ticketCreditLimitMantissa: null,
    maxExitFeeMantissa: null,
    owner: null
  },
  prize: {
    canStartAward: null,
    canCompleteAward: null,
    externalErc20Awards: null,
    externalErc721Awards: null,
    isRngTimedOut: null,
    prizePeriodRemainingSeconds: null,
    isRngRequested: null,
    prizePeriodSeconds: null,
    supplyRatePerBlock: null,
    awardBalance: null,
    sablierStream: {
      id: null,
      idBN: null,
      amount: null,
      amountUnformatted: null,
      amountPerPrizePeriod: null,
      amountPerPrizePeriodUnformatted: null,
      tokenName: null,
      tokenSymbol: null,
      totalDeposit: null,
      totalDepositUnformatted: null,
      tokenDecimals: null,
      tokenAddress: null,
      startTime: null,
      stopTime: null,
      ratePerSecond: null
    }
  },
  sponsorship: {
    address: null,
    name: null,
    symbol: null,
    totalSupply: null,
    totalSupplyUnformatted: null,
    decimals: null
  },
  ticket: {
    address: null,
    name: null,
    symbol: null,
    decimals: null,
    totalSupply: null,
    totalSupplyUnformatted: null
  },
  token: {
    address: null,
    symbol: null,
    name: null,
    decimals: null
  },
  totalSupply: null,
  totalSupplyUnformatted: null
})
