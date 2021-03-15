import { ethers } from 'ethers'

import { DEFAULT_TOKEN_PRECISION } from 'lib/constants'
import { stringWithPrecision } from 'lib/utils/stringWithPrecision'

/**
 * Pretty up a BigNumber using it's corresponding ERC20 decimals value with the proper amount of
 * trailing decimal precision
 * @param {*} amount BigNumber|string|number to format
 * @param {*} decimals precision to use when converting from BigNumber to string
 * example: a BigNumber value of 123456 for WBTC which has 8 decimals of precision
 *          would be formatted as: 0.00123456
 */
export const numberWithCommas = (amount, options = {}) => {
  if (!options.decimals) {
    options.decimals = DEFAULT_TOKEN_PRECISION
  }

  if (!amount) {
    return
  }

  const amountFormatted =
    typeof amount === 'string' || typeof amount === 'number'
      ? amount
      : ethers.utils.formatUnits(amount, options.decimals)

  if (!options.precision && options.precision !== 0) {
    options.precision = getPrecision(amountFormatted)
  }

  return _formatCommas(amountFormatted, options)
}

function _formatCommas(str, options = {}) {
  if (!str) {
    return typeof str === 'number' ? str : ''
  }

  let precision = 2
  if (options.precision !== undefined) {
    precision = options.precision
  }

  let localeString = 'en-GB'
  if (options.currentLang && options.currentLang === 'es') {
    localeString = 'es-ES'
  }

  // auto-round to the nearest whole number
  if (precision === 0) {
    str = Math.floor(Number(str))
  }

  // handle exponents
  if (str.toString().match('e')) {
    str = Number.parseFloat(str).toFixed(0)
  }

  let parts = str.toString().split('.')
  parts[0] = parts[0].replace(',', '')

  let numberStr = ''

  if (parts.length > 1 && precision > 0) {
    numberStr = stringWithPrecision(parts.join('.'), { precision })
  } else {
    numberStr = parts[0]
  }

  if (options.removeTrailingZeros) {
    numberStr = numberStr.replace(/(\.0+|0+)$/, '')
  }

  return Number(numberStr).toLocaleString(localeString, {
    minimumFractionDigits: options.removeTrailingZeros ? 0 : precision
  })
}

/**
 * Returns a standardized decimal precision depending on the number
 * @param {*} num number to check
 */
export const getPrecision = (num) => {
  num = parseFloat(num)

  if (num > 10000) {
    return 0
  } else if (num >= 0.1) {
    return 2
  } else {
    return getMinPrecision(num)
  }
}

/**
 * Returns the number of digits after a decimal place
 * @param {*} num number to check
 */
export const getMaxPrecision = (num) => {
  return String(num).split('.')[1]?.length || 0
}

/**
 * Counts the number of 0's past a decimal in a number and returns how many significant digits to keep
 * plus additional digits so we always show a non-zero number.
 * @param {*} num number to check
 * @param {*} options
 *    additionalDigits: Optional additional digits to keep past the first non-zero number
 */
export const getMinPrecision = (num, options = { additionalDigits: 2 }) => {
  const { additionalDigits } = options
  const decimals = String(num).split('.')[1]

  if (decimals === '0') return 0
  if (!decimals) return additionalDigits
  return decimals.match(/^0*/)[0].length + additionalDigits
}
