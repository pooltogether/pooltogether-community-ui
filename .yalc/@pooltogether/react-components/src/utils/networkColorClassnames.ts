export const networkTextColorClassname = (chainId) => {
  if (chainId === 1) {
    return 'blue'
  } else if (chainId === 3) {
    return 'red'
  } else if (chainId === 4) {
    return 'orange'
  } else if (chainId === 5) {
    return 'blue'
  } else if (chainId === 42) {
    return 'default-soft'
  } else if (chainId === 56) {
    return 'yellow'
  } else if (chainId === 137) {
    return 'default-soft'
  } else if (chainId === 1234) {
    return 'teal'
  } else if (chainId === 42220) {
    return 'green'
  } else if (chainId === 80001) {
    return 'teal'
  } else {
    return 'darkened'
  }
}

export const networkBgColorClassname = (chainId) => {
  if (chainId === 1) {
    return 'blue'
  } else if (chainId === 3) {
    return 'red'
  } else if (chainId === 4) {
    return 'orange'
  } else if (chainId === 5) {
    return 'blue'
  } else if (chainId === 42) {
    return 'purple'
  } else if (chainId === 56) {
    return 'yellow'
  } else if (chainId === 137) {
    return 'purple'
  } else if (chainId === 1234) {
    return 'teal'
  } else if (chainId === 80001) {
    return 'teal'
  } else {
    return 'black'
  }
}
