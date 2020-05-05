const expression = /^(\w{6})\w*(\w{4})$/

export function shortenAddress (address) {
  let result

  if (!address) { return null }

  result = expression.exec(address)

  return `${result[1]}..${result[2]}`
}
