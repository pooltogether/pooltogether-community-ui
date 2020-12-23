import { addSeconds } from 'date-fns'
import { useAtom } from 'jotai'
import { useInterval } from 'lib/hooks/useInterval'
import { poolChainValuesAtom } from 'lib/hooks/usePoolChainValues'
import { subtractDates } from 'lib/utils/subtractDates'
import { useEffect, useState } from 'react'

export const useTimeLeft = () => {
  const [poolChainValues] = useAtom(poolChainValuesAtom)
  const poolValueSecondsLeft = parseInt(poolChainValues.prizePeriodRemainingSeconds.toString(), 10)
  const [secondsLeft, setSecondsLeft] = useState(poolValueSecondsLeft)

  useEffect(() => {
    if (poolValueSecondsLeft > secondsLeft) {
      setSecondsLeft(poolValueSecondsLeft)
    }
  }, [poolValueSecondsLeft])

  useInterval(() => {
    const newRemainder = secondsLeft - 1
    if (newRemainder >= 0) {
      setSecondsLeft(newRemainder)
    }
  }, 1000)

  const currentDate = new Date(Date.now())
  const futureDate = addSeconds(currentDate, secondsLeft)
  return subtractDates(futureDate, currentDate)
}
