const nullPattern = /^null | null$|^[^(]* null /i
const undefinedPattern = /^undefined | undefined$|^[^(]* undefined /i
export function idx(input, accessor) {
  try {
    return accessor(input)
  } catch (error) {
    if (error instanceof TypeError) {
      if (nullPattern.test(error)) {
        return null
      } else if (undefinedPattern.test(error)) {
        return undefined
      }
    }
    throw error
  }
}

export default idx
