export function displayPercentage(percentage) {
  percentage = parseFloat(percentage).toFixed(2)
  return percentage.toString().replace(/(\.0+$)|(0+$)/, '')
}
