/**
 * Convert a number of days to seconds
 * @param {*} days
 */
export function daysToSeconds (days) {
  return Math.round(days * 24 * 60 * 60)
}

/**
 * Convert a whole percent number to a fraction
 * @param {*} percent as a whole number ex. percentageToFraction(100) => 100% => 1
 */
export function percentageToFraction (percent) {
  return parseFloat(percent) / 100
}
