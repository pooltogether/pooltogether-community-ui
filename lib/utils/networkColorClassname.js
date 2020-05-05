export const networkColorClassname = (networkId) => {
  if (networkId === 4) {
    return 'text-yellow-500'
  } else if (networkId === 3) {
    return 'text-red-600'
  } else if (networkId === 5) {
    return 'text-blue-400'
  } else if (networkId === 1234) {
    return 'text-teal-400'
  } else if (networkId === 42) {
    return 'text-purple-300'
  }
}
