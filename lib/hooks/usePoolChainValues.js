import { useEffect } from 'react'
import { atom, useAtom } from 'jotai'
import { ethers } from 'ethers'
import { batch, contract } from '@pooltogether/etherplex'

import { errorStateAtom, getDataFetchingErrorMessage } from 'lib/components/PoolData'
import {
  CONTRACTS,
  CONTRACT_ADDRESSES,
  DATA_REFRESH_POLLING_INTERVAL,
  PRIZE_POOL_TYPE
} from 'lib/constants'
import { useReadProvider } from 'lib/hooks/useReadProvider'
import { poolAddressesAtom } from 'lib/hooks/usePoolAddresses'
import { useInterval } from 'lib/hooks/useInterval'
import { contractVersionsAtom, prizePoolTypeAtom } from 'lib/hooks/useDetermineContractVersions'
import { calculateSablierPrize } from 'lib/utils/calculateSablierPrize'
import { useNetwork } from 'lib/hooks/useNetwork'

import SablierAbi from 'abis/SablierAbi'
import ERC20Abi from 'abis/ERC20Abi'
import CTokenAbi from '@pooltogether/pooltogether-contracts/abis/CTokenInterface'
import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'
import SablierManagerAbi from '@pooltogether/pooltogether-contracts/abis/SablierManager'
import MultipleWinnersPrizeStrategyAbi from '@pooltogether/pooltogether-contracts/abis/MultipleWinners'
import SingleRandomWinnerPrizeStrategyAbi from '@pooltogether/pooltogether-contracts/abis/SingleRandomWinner'

export const poolChainValuesAtom = atom({
  loading: true
})

export const usePoolChainValues = () => {
  const [poolAddresses] = useAtom(poolAddressesAtom)
  const [errorState, setErrorState] = useAtom(errorStateAtom)
  const [prizePoolType] = useAtom(prizePoolTypeAtom)
  const [poolChainValues, setPoolChainValues] = useAtom(poolChainValuesAtom)
  const [contractVersions] = useAtom(contractVersionsAtom)
  const { readProvider: provider, isLoaded: readProviderLoaded } = useReadProvider()
  const [chainId] = useNetwork()

  // React to changes to data
  useEffect(() => {
    if (!readProviderLoaded || !poolAddresses) return

    fetchPoolChainValues(
      provider,
      chainId,
      poolAddresses,
      prizePoolType,
      setPoolChainValues,
      contractVersions?.prizeStrategy?.contract,
      setErrorState
    )
  }, [readProviderLoaded, provider, poolAddresses, prizePoolType])

  // Keep data up to date
  useInterval(() => {
    if (!readProviderLoaded || !poolAddresses) return

    fetchPoolChainValues(
      provider,
      chainId,
      poolAddresses,
      prizePoolType,
      setPoolChainValues,
      contractVersions?.prizeStrategy?.contract,
      setErrorState
    )
  }, DATA_REFRESH_POLLING_INTERVAL)

  return [poolChainValues, setPoolChainValues]
}

export const fetchPoolChainValues = async (
  provider,
  chainId,
  poolAddresses,
  prizePoolType,
  setPoolChainValues,
  prizeStrategyContract,
  setErrorState
) => {
  const {
    prizeStrategy,
    ticket,
    sponsorship,
    token,
    cToken,
    prizePool,
    beforeAwardListener
  } = poolAddresses

  if (provider && prizeStrategy && ticket && sponsorship && prizePool) {
    try {
      const prizeStrategyRequests = getPrizeStrategyRequests(prizeStrategy, prizeStrategyContract)
      const etherplexTicketContract = contract('ticket', ERC20Abi, ticket)
      const etherplexSponsorshipContract = contract('sponsorship', ERC20Abi, sponsorship)
      const etherplexTokenContract = contract('token', ERC20Abi, token)
      const etherplexPrizePoolContract = contract('prizePool', PrizePoolAbi, prizePool)

      const batchRequests = [
        prizeStrategyRequests,
        etherplexTicketContract.name().symbol().totalSupply().decimals(),
        etherplexSponsorshipContract.name().symbol().totalSupply(),
        etherplexTokenContract.decimals().symbol().name(),
        etherplexPrizePoolContract
          .captureAwardBalance()
          .creditPlanOf(ticket)
          .maxExitFeeMantissa()
          .maxTimelockDuration()
          .owner()
      ]

      if (prizePoolType === PRIZE_POOL_TYPE.compound) {
        const etherplexCTokenContract = contract('cToken', CTokenAbi, cToken)
        batchRequests.push(etherplexCTokenContract.supplyRatePerBlock())
      }

      const values = await batch(provider, ...batchRequests)

      let sablierStream = null
      if (beforeAwardListener) {
        sablierStream = await fetchSablierStreamChainValues(
          provider,
          chainId,
          beforeAwardListener,
          prizePool,
          {
            prizePeriodStartedAt: values.prizeStrategy.prizePeriodStartedAt[0],
            prizePeriodSeconds: values.prizeStrategy.prizePeriodSeconds[0],
            isRngRequested: values.prizeStrategy.isRngRequested[0]
          }
        )
      }

      const poolTotalSupply = ethers.BigNumber.from(values.ticket.totalSupply[0]).add(
        values.sponsorship.totalSupply[0]
      )

      let decimals = values.token.decimals[0]
      // default to 18 if the ERC20 contract returns 0 for decimals
      decimals = decimals === 0 ? 18 : decimals

      setPoolChainValues((existingValues) => ({
        ...existingValues,
        canStartAward: values.prizeStrategy.canStartAward[0],
        canCompleteAward: values.prizeStrategy.canCompleteAward[0],
        externalErc20Awards: values.prizeStrategy.getExternalErc20Awards[0],
        externalErc721Awards: values.prizeStrategy.getExternalErc721Awards[0],
        isRngRequested: values.prizeStrategy.isRngRequested[0],
        isRngTimedOut: values.prizeStrategy.isRngTimedOut[0],
        prizePeriodSeconds: values.prizeStrategy.prizePeriodSeconds[0],
        prizePeriodRemainingSeconds: values.prizeStrategy.prizePeriodRemainingSeconds[0],
        numberOfWinners: values.prizeStrategy.numberOfWinners?.[0] || 1,

        supplyRatePerBlock: values?.cToken?.supplyRatePerBlock[0],

        sponsorshipName: values.sponsorship.name[0],
        sponsorshipSymbol: values.sponsorship.symbol[0],
        sponsorshipTotalSupply: values.sponsorship.totalSupply[0],

        ticketName: values.ticket.name[0],
        ticketSymbol: values.ticket.symbol[0],
        ticketDecimals: values.ticket.decimals[0],
        ticketTotalSupply: values.ticket.totalSupply[0],

        awardBalance: values.prizePool.captureAwardBalance[0],
        maxTimelockDuration: values.prizePool.maxTimelockDuration[0],
        ticketCreditRateMantissa: values.prizePool.creditPlanOf.creditRateMantissa,
        ticketCreditLimitMantissa: values.prizePool.creditPlanOf.creditLimitMantissa,
        maxExitFeeMantissa: values.prizePool.maxExitFeeMantissa[0],
        owner: values.prizePool.owner[0],

        poolTotalSupply,

        sablierStream,

        tokenDecimals: decimals,
        tokenSymbol: values.token.symbol[0],
        tokenName: values.token.name[0],
        tokenAddress: token,

        loading: false
      }))
    } catch (e) {
      console.error(e)
      setErrorState({
        error: true,
        errorMessage: getDataFetchingErrorMessage(prizePool, 'pool chain values', e.message)
      })
      return
    }
  }
}

const fetchSablierStreamChainValues = async (
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
    const tokenContract = contract(
      'sablierToken',
      ERC20Abi,
      sablierValues.sablier.getStream.tokenAddress
    )
    const tokenValues = await batch(provider, tokenContract.decimals().symbol().name())

    const { amountThisPrizePeriod, amountPerPrizePeriod } = calculateSablierPrize(
      {
        startTime: sablierValues.sablier.getStream.startTime,
        stopTime: sablierValues.sablier.getStream.stopTime,
        ratePerSecond: sablierValues.sablier.getStream.ratePerSecond
      },
      prizeStrategyData
    )

    return {
      id: streamId.toNumber(),
      idBN: streamId,
      amount: ethers.utils.formatUnits(amountThisPrizePeriod, tokenValues.sablierToken.decimals[0]),
      amountUnformatted: amountThisPrizePeriod,
      amountPerPrizePeriod: ethers.utils.formatUnits(
        amountPerPrizePeriod,
        tokenValues.sablierToken.decimals[0]
      ),
      amountPerPrizePeriodUnformatted: amountPerPrizePeriod,
      tokenDecimals: tokenValues.sablierToken.decimals[0],
      tokenName: tokenValues.sablierToken.name[0],
      tokenSymbol: tokenValues.sablierToken.symbol[0],
      tokenAddress: sablierValues.sablier.getStream.tokenAddress,
      startTime: sablierValues.sablier.getStream.startTime,
      stopTime: sablierValues.sablier.getStream.stopTime,
      ratePerSecond: sablierValues.sablier.getStream.ratePerSecond,
      totalDeposit: ethers.utils.formatUnits(
        sablierValues.sablier.getStream.deposit,
        tokenValues.sablierToken.decimals[0]
      ),
      totalDepositUnformatted: sablierValues.sablier.getStream.deposit
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
