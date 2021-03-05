import { ethers } from 'ethers'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

export function displayAmountInEther(amount, options = {}) {
  if (amount === 0) {
    amount = ethers.BigNumber.from(0)
  }

  if (!amount) {
    return ''
  }

  let precision = 2
  if (options.precision !== undefined) {
    precision = options.precision
  }

  let commify = true
  if (options.commify !== undefined) {
    commify = options.commify
  }

  let decimals = 18
  if (options.decimals !== undefined) {
    decimals = options.decimals
  }

  let etherValueAsString = ethers.utils.formatUnits(amount.toString(), decimals)

  if (/\.\d$/.test(etherValueAsString)) {
    etherValueAsString += '0'
  }

  if (commify === true) {
    return numberWithCommas(etherValueAsString, {
      ...options,
      precision,
    })
  } else {
    const precisionWithDecimal = precision > 0 ? precision + 1 : 0

    return etherValueAsString.substr(0, etherValueAsString.indexOf('.') + precisionWithDecimal)
  }
}
