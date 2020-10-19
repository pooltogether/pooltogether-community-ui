export const extractPrevDripTokenAddress = (prevDripTokens, dripTokenToDeactivatesAddress) => {
  if (prevDripTokens.length <= 1) {
    return null
  }

  const index = prevDripTokens.map(token => token.id).indexOf(dripTokenToDeactivatesAddress)
  console.log({index})

  if (index !== 0) {
    return prevDripTokens[index - 1].id
  }
}
