export const getDateFromSeconds = (seconds) => {
  const date = new Date(0)
  date.setSeconds(seconds)
  return date
}
