export const subtractDates = (dateA, dateB) => {
  let msA = dateA.getTime()
  let msB = dateB.getTime()

  let diff = msA - msB

  let days = 0
  if (diff >= 86400000) {
    days = parseInt(diff / 86400000, 10)
    diff -= days * 86400000
  }

  let hours = 0
  if (days || diff >= 3600000) {
    hours = parseInt(diff / 3600000, 10)
    diff -= hours * 3600000
  }

  let minutes = 0
  if (hours || diff >= 60000) {
    minutes = parseInt(diff / 60000, 10)
    diff -= minutes * 60000
  }

  let seconds = 0
  if (minutes || diff >= 1000) {
    seconds = parseInt(diff / 1000, 10)
  }

  return {
    days,
    hours,
    minutes,
    seconds
  }
}
