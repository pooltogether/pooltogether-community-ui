export const networkColorClassname = (networkId) => {
  if (networkId === 4) {
    return 'text-yellow-1'
  } else if (networkId === 3) {
    return 'text-red-1'
  } else if (networkId === 5) {
    return 'text-blue'
  } else if (networkId === 1234) {
    return 'text-teal'
  } else if (networkId === 42) {
    return 'text-highlight-1'
  }
}
