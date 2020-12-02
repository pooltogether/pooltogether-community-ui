import { batch, contract } from '@pooltogether/etherplex'
import { ethers } from 'ethers'

import ERC20Abi from 'ERC20Abi'
import CTokenAbi from '@pooltogether/pooltogether-contracts/abis/CTokenInterface'
import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'
import ProxyFactory from '@pooltogether/pooltogether-contracts/abis/ProxyFactory'
import SingleRandomWinnerAbi from '@pooltogether/pooltogether-contracts/abis/SingleRandomWinner'
import CompoundPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/CompoundPrizePool'
import StakePrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/StakePrizePool'

import { readProvider } from 'lib/utils/getReadProvider'
import { nameToChainId } from 'lib/utils/nameToChainId'
import { BLOCK_NUMBERS, CONTRACT_ADDRESSES, PrizePoolType } from 'lib/constants'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

const bn = ethers.utils.bigNumberify

export const fetchPoolAddresses = async (provider, poolAddresses, setPoolAddresses, poolType) => {
  const { prizePool, ticket } = poolAddresses

  if (prizePool && !ticket) {
    try {
      if (poolType === PrizePoolType.compound) {
        // Query Prize Pool
        const etherplexPrizePoolContract = contract('prizePool', CompoundPrizePoolAbi, prizePool)
        console.log(etherplexPrizePoolContract)
        const poolValues = await batch(
          provider,
          etherplexPrizePoolContract
            .token()
            .cToken()
            .prizeStrategy()
        )
        console.log(poolValues)

        const { token, cToken, prizeStrategy } = poolValues.prizePool
        // Query Prize Strategy
        const etherplexPrizeStrategyContract = contract(
          'prizeStrategy',
          SingleRandomWinnerAbi,
          prizeStrategy[0]
        )
        const strategyValues = await batch(
          provider,
          etherplexPrizeStrategyContract
            .tokenListener() // comptroller
            .rng()
            .sponsorship()
            .ticket()
        )
        const { rng, sponsorship, ticket, tokenListener } = strategyValues.prizeStrategy
        // Update State
        setPoolAddresses((existingValues) => ({
          ...existingValues,
          tokenListener: tokenListener[0],
          token: token[0],
          cToken: cToken[0],
          prizeStrategy: prizeStrategy[0],
          rng: rng[0],
          sponsorship: sponsorship[0],
          ticket: ticket[0]
        }))
      } else if (poolType === PrizePoolType.stake) {
        // Query Prize Pool
        const etherplexPrizePoolContract = contract('prizePool', StakePrizePoolAbi, prizePool)
        console.log(etherplexPrizePoolContract)
        const poolValues = await batch(provider, etherplexPrizePoolContract.token().prizeStrategy())
        console.log(poolValues)
        const { token, stakeToken, prizeStrategy } = poolValues.prizePool
        // Query Prize Strategy
        const etherplexPrizeStrategyContract = contract(
          'prizeStrategy',
          SingleRandomWinnerAbi,
          prizeStrategy[0]
        )
        const strategyValues = await batch(
          provider,
          etherplexPrizeStrategyContract
            .tokenListener() // comptroller
            .rng()
            .sponsorship()
            .ticket()
        )
        const { rng, sponsorship, ticket, tokenListener } = strategyValues.prizeStrategy
        // Update State
        setPoolAddresses((existingValues) => ({
          ...existingValues,
          tokenListener: tokenListener[0],
          token: token[0],
          prizeStrategy: prizeStrategy[0],
          rng: rng[0],
          sponsorship: sponsorship[0],
          ticket: ticket[0]
        }))
      }
    } catch (e) {
      console.error(e)

      setPoolAddresses({
        error: true,
        errorMessage: e.message
      })

      return
    }
  }
}

export const fetchGenericChainValues = async (
  provider,
  poolAddresses,
  setGenericChainValues,
  poolType
) => {
  const { prizeStrategy, ticket, sponsorship, token, cToken, prizePool } = poolAddresses

  if (provider && prizeStrategy && ticket && sponsorship && prizePool) {
    try {
      const etherplexPrizeStrategyContract = contract(
        'singleRandomWinner',
        SingleRandomWinnerAbi,
        prizeStrategy
      )
      const etherplexTicketContract = contract('ticket', ERC20Abi, ticket)
      const etherplexSponsorshipContract = contract('sponsorship', ERC20Abi, sponsorship)
      const etherplexTokenContract = contract('token', ERC20Abi, token)
      const etherplexPrizePoolContract = contract('prizePool', PrizePoolAbi, prizePool)

      console.log(etherplexPrizePoolContract)

      const batchRequests = [
        etherplexPrizeStrategyContract
          .isRngRequested() // used to determine if the pool is locked
          .canStartAward()
          .canCompleteAward()
          .prizePeriodRemainingSeconds()
          .getExternalErc20Awards()
          .getExternalErc721Awards(),
        etherplexTicketContract
          .name()
          .symbol()
          .totalSupply()
          .decimals(),
        etherplexSponsorshipContract
          .name()
          .symbol()
          .totalSupply(),
        etherplexTokenContract.decimals().symbol(),
        etherplexPrizePoolContract
          .captureAwardBalance()
          .creditPlanOf(ticket)
          .maxExitFeeMantissa()
      ]

      if (poolType === PrizePoolType.compound) {
        const etherplexCTokenContract = contract('cToken', CTokenAbi, cToken)
        batchRequests.push(etherplexCTokenContract.supplyRatePerBlock())
      }

      const values = await batch(provider, ...batchRequests)

      console.log(values)

      const poolTotalSupply = ethers.utils
        .bigNumberify(values.ticket.totalSupply[0])
        .add(values.sponsorship.totalSupply[0])

      let decimals = values.token.decimals[0]
      // default to 18 if the ERC20 contract returns 0 for decimals
      decimals = decimals === 0 ? 18 : decimals

      setGenericChainValues((existingValues) => ({
        ...existingValues,
        canStartAward: values.singleRandomWinner.canStartAward[0],
        canCompleteAward: values.singleRandomWinner.canCompleteAward[0],
        externalErc20Awards: values.singleRandomWinner.getExternalErc20Awards[0],
        supplyRatePerBlock: values?.cToken?.supplyRatePerBlock[0],
        isRngRequested: values.singleRandomWinner.isRngRequested[0],
        prizePeriodRemainingSeconds: values.singleRandomWinner.prizePeriodRemainingSeconds[0],
        sponsorshipName: values.sponsorship.name,
        sponsorshipSymbol: values.sponsorship.symbol,
        sponsorshipTotalSupply: values.sponsorship.totalSupply[0],
        ticketName: values.ticket.name,
        ticketSymbol: values.ticket.symbol,
        ticketDecimals: values.ticket.decimals[0],
        ticketTotalSupply: values.ticket.totalSupply[0],
        awardBalance: values.prizePool.captureAwardBalance[0],
        ticketCreditRateMantissa: values.prizePool.creditPlanOf.creditRateMantissa,
        ticketCreditLimitMantissa: values.prizePool.creditPlanOf.creditLimitMantissa,
        maxExitFeeMantissa: values.prizePool.maxExitFeeMantissa[0],
        poolTotalSupply: poolTotalSupply,
        tokenDecimals: decimals,
        tokenSymbol: values.token.symbol[0],
        loading: false
      }))
    } catch (e) {
      setGenericChainValues({
        error: true,
        errorMessage: e.message
      })

      console.warn(e.message)
      // console.error(e)
    }
  }
}

export const fetchUsersChainValues = async (
  provider,
  usersAddress,
  poolAddresses,
  setUsersChainValues
) => {
  const { token, prizePool, ticket } = poolAddresses

  if (token && prizePool && ticket) {
    try {
      const etherplexPrizePoolContract = contract('prizePool', CompoundPrizePoolAbi, prizePool)
      const etherplexTicketContract = contract('ticket', ERC20Abi, ticket)
      const etherplexTokenContract = contract('token', ERC20Abi, token)

      const values = await batch(
        provider,
        etherplexPrizePoolContract
          .timelockBalanceOf(usersAddress)
          .timelockBalanceAvailableAt(usersAddress),
        etherplexTicketContract.balanceOf(usersAddress),
        etherplexTokenContract.balanceOf(usersAddress).allowance(usersAddress, prizePool)
      )

      setUsersChainValues((existingValues) => ({
        ...existingValues,
        usersTicketBalance: values.ticket.balanceOf[0],
        usersTokenAllowance: values.token.allowance[0],
        usersTokenBalance: values.token.balanceOf[0],
        usersTimelockBalanceAvailableAt: values.prizePool.timelockBalanceAvailableAt[0],
        usersTimelockBalance: values.prizePool.timelockBalanceOf[0],
        loading: false
      }))
    } catch (e) {
      setUsersChainValues({
        error: true,
        errorMessage: e.message
      })

      console.warn(e.message)
    }
  }
}

const determinePoolType = async (provider, poolAddresses, chainId) => {
  const { prizePool } = poolAddresses
  if (!prizePool) return

  const mostRecentBlockNumber = await provider.getBlockNumber()

  try {
    let prizePoolType

    // Check Compound Prize Pool Proxy Factory for an event emitting the given address
    prizePoolType = await checkPrizePoolProxyType(
      provider,
      prizePool,
      CONTRACT_ADDRESSES[chainId].COMPOUND_PRIZE_POOL_PROXY,
      BLOCK_NUMBERS[chainId].COMPOUND_PRIZE_POOL_PROXY,
      mostRecentBlockNumber,
      PrizePoolType.compound
    )
    if (prizePoolType) {
      return prizePoolType
    }

    // Check Stake Prize Pool Proxy Factory for an event emitting the given address
    prizePoolType = await checkPrizePoolProxyType(
      provider,
      prizePool,
      CONTRACT_ADDRESSES[chainId].STAKE_PRIZE_POOL_PROXY,
      BLOCK_NUMBERS[chainId].STAKE_PRIZE_POOL_PROXY,
      mostRecentBlockNumber,
      PrizePoolType.stake
    )
    if (prizePoolType) {
      return prizePoolType
    }
  } catch (e) {
    console.error(e)
    return
  }
}

const checkPrizePoolProxyType = async (
  provider,
  prizePoolAddress,
  prizePoolProxyContractAddress,
  prizePoolProxyContractBlockNumber,
  mostRecentBlockNumber,
  type
) => {
  const prizePoolProxyContract = new ethers.Contract(
    prizePoolProxyContractAddress,
    ProxyFactory,
    provider
  )
  const proxyCreatedEventFilter = prizePoolProxyContract.filters.ProxyCreated()
  const proxyLogs = await provider.getLogs({
    ...proxyCreatedEventFilter,
    fromBlock: prizePoolProxyContractBlockNumber,
    toBlock: mostRecentBlockNumber
  })

  if (
    proxyLogs
      .map((d) => prizePoolProxyContract.interface.parseLog(d).values.proxy)
      .includes(prizePoolAddress)
  ) {
    return type
  }

  return
}

export const fetchChainData = async (
  networkName,
  usersAddress,
  poolAddresses,
  setPoolAddresses,
  setGenericChainValues,
  setUsersChainValues
) => {
  const provider = await readProvider(networkName)
  const chainId = nameToChainId(networkName)

  const poolType = await determinePoolType(provider, poolAddresses, chainId)
  fetchPoolAddresses(provider, poolAddresses, setPoolAddresses, poolType)
  fetchGenericChainValues(provider, poolAddresses, setGenericChainValues, poolType)

  if (usersAddress) {
    fetchUsersChainValues(provider, usersAddress, poolAddresses, setUsersChainValues)
  }
}

export const fetchErc20AwardBalances = async (networkName, poolAddress, erc20Addresses) => {
  const provider = await readProvider(networkName)
  const batchCalls = []
  let etherplexTokenContract

  // Prepare batched calls
  for (const address of erc20Addresses) {
    etherplexTokenContract = contract(address, ERC20Abi, address)
    batchCalls.push(
      etherplexTokenContract
        .balanceOf(poolAddress)
        .name()
        .symbol()
        .decimals()
    )
  }

  const values = await batch(provider, ...batchCalls)
  const flattenedValues = []

  for (const [address, value] of Object.entries(values)) {
    const formattedBalance = displayAmountInEther(value.balanceOf[0], {
      precision: 4,
      decimals: value.decimals[0]
    })

    flattenedValues.push({
      address,
      formattedBalance,
      balance: value.balanceOf[0],
      name: value.name[0],
      decimals: value.decimals[0],
      symbol: value.symbol[0]
    })
  }

  return flattenedValues
}
