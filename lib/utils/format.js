import { ethers } from 'ethers'

/**
 * Convert a number of days to seconds
 * @param {*} days
 */
export function daysToSeconds (days) {
  return Math.round(days * 24 * 60 * 60)
}

/**
 * Convert a number of days to seconds.
 * Rounding to 4 significant digits (minimum value is ~8 seconds).
 * @param {*} seconds
 */
export function secondsToDaysForInput (seconds) {
  return Math.round((seconds / 60 / 60 / 24) * 10000) / 10000
}

/**
 * Convert a whole percent number to a fraction
 * @param {*} percent as a whole number ex. percentageToFraction(100) => 100% => 1
 */
export function percentageToFraction (percent) {
  return parseFloat(percent) / 100
}

/**
 * Convert a fraction to a whole number
 */
export function fractionToPercentage (fraction) {
  return Math.round(fraction * 100)
}

export function getCreditRateMantissaAndLimitMantissa (
  ticketCreditMaturationInDays,
  ticketCreditLimitPercentage
) {
  console.log(
    'getCreditRateMantissaAndLimitMantissa',
    ticketCreditMaturationInDays,
    ticketCreditLimitPercentage
  )
  const creditMaturationInSeconds = daysToSeconds(ticketCreditMaturationInDays)
  const creditLimitMantissa = percentageToFraction(ticketCreditLimitPercentage).toString()

  const ticketCreditRateMantissa = creditMaturationInSeconds
    ? ethers.utils.parseEther(creditLimitMantissa).div(creditMaturationInSeconds)
    : ethers.utils.bigNumberify(0)
  const ticketCreditLimitMantissa = ethers.utils.parseEther(creditLimitMantissa)

  return [ticketCreditRateMantissa, ticketCreditLimitMantissa]
}

export function getCreditMaturationDaysAndLimitPercentage (
  ticketCreditRateMantissa,
  ticketCreditLimitMantissa
) {
  console.log(
    'getCreditMaturationDaysAndLimitPercentage',
    ticketCreditRateMantissa.toString(),
    ticketCreditLimitMantissa.toString(),
    ticketCreditRateMantissa.gt(0)
  )

  const creditLimitMantissa = ethers.utils.formatEther(ticketCreditLimitMantissa)
  const creditLimitPercentage = fractionToPercentage(creditLimitMantissa)
  const creditMaturationInSeconds = ticketCreditRateMantissa.gt(0)
    ? ticketCreditLimitMantissa.div(ticketCreditRateMantissa)
    : 0
  const creditMaturationInDays = secondsToDaysForInput(creditMaturationInSeconds)
  console.log(creditMaturationInSeconds, creditMaturationInDays, creditLimitPercentage)
  return [creditMaturationInDays, creditLimitPercentage]
}
