import { ethers } from 'ethers'
import { DEFAULT_TOKEN_PRECISION } from 'lib/constants'

export const getErc20InputProps = (decimals = DEFAULT_TOKEN_PRECISION, allowZero = false) => ({
  step: getStep(decimals),
  min: allowZero ? '0' : getMin(decimals)
})

const getStep = (decimals) => ethers.utils.formatUnits('1', decimals)
const getMin = (decimals) => ethers.utils.formatUnits('1', decimals)
