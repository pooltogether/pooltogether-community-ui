import { ethers } from 'ethers'
import { getMinPrecision, numberWithCommas } from 'lib/utils/numberWithCommas'

/**
 * Convert a number of days to seconds
 * @param {*} days
 */
export function daysToSeconds(days) {
  return Math.round(days * 24 * 60 * 60)
}

/**
 * Convert a number of days to seconds.
 * Rounding to 4 significant digits (minimum value is ~8 seconds).
 * @param {*} seconds
 */
export function secondsToDaysForInput(seconds) {
  return Math.round((seconds / 60 / 60 / 24) * 10000) / 10000
}

/**
 * Convert a whole percent number to a fraction
 * @param {*} percent as a whole number ex. percentageToFraction(100) => 100% => 1
 */
export function percentageToFraction(percent) {
  return parseFloat(percent) / 100
}

/**
 * Convert a fraction to a whole number
 */
export function fractionToPercentage(fraction) {
  return Math.round(fraction * 100)
}

/**
 * Pretty up a BigNumber using it's corresponding ERC20 decimals value with the proper amount of
 * trailing decimal precision
 * @param {*} amountBN BigNumber to format
 * @param {*} decimals precision to use when converting from BigNumber to string
 * example: a BigNumber value of 123456 for WBTC which has 8 decimals of precision
 *          would be formatted as: 0.00123456
 */
export const amountWithCommas = (amountBN, decimals) => {
  const amountFormatted = ethers.utils.formatUnits(amountBN, decimals)
  return numberWithCommas(amountFormatted, {
    precision: getMinPrecision(amountFormatted)
  })
}

export function getCreditRateMantissaAndLimitMantissa(
  ticketCreditMaturationInDays,
  ticketCreditLimitPercentage
) {
  const creditMaturationInSeconds = daysToSeconds(ticketCreditMaturationInDays)
  const creditLimitMantissa = percentageToFraction(ticketCreditLimitPercentage).toString()

  const ticketCreditRateMantissa = creditMaturationInSeconds
    ? ethers.utils.parseEther(creditLimitMantissa).div(creditMaturationInSeconds)
    : ethers.BigNumber.from(0)
  const ticketCreditLimitMantissa = ethers.utils.parseEther(creditLimitMantissa)

  return [ticketCreditRateMantissa, ticketCreditLimitMantissa]
}

export function getCreditMaturationDaysAndLimitPercentage(
  ticketCreditRateMantissa,
  ticketCreditLimitMantissa
) {
  const creditLimitMantissa = ethers.utils.formatEther(ticketCreditLimitMantissa)
  const creditLimitPercentage = fractionToPercentage(creditLimitMantissa)
  const creditMaturationInSeconds = ticketCreditRateMantissa.gt(0)
    ? ticketCreditLimitMantissa.div(ticketCreditRateMantissa)
    : 0
  const creditMaturationInDays = secondsToDaysForInput(creditMaturationInSeconds)
  return [creditMaturationInDays, creditLimitPercentage]
}
