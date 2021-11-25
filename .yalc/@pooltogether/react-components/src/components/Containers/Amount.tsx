import React, { useEffect, useState } from 'react'

const SPLIT_LENGTH = 2

export function Amount(props) {
  const [firstPart, setFirstPart] = useState(null)
  const [secondPart, setSecondPart] = useState(null)
  const [thirdPart, setThirdPart] = useState(null)
  const [fourthPart, setFourthPart] = useState(null)

  useEffect(() => {
    const str = typeof props.children === 'object' ? props.children[0] : props.children?.toString()

    if (str?.length > 0) {
      const parts = str.split('.')

      if (parts[0]) {
        setFirstPart(parts[0])
      }

      if (parts[1] && parts[1].length >= SPLIT_LENGTH) {
        setSecondPart(parts[1].substring(0, 2 + (SPLIT_LENGTH - 2)))

        const firstSpaceIndex = parts[1].indexOf(' ')
        const indexOrLength = firstSpaceIndex > 0 ? firstSpaceIndex : parts[1].length
        setThirdPart(parts[1].substring(SPLIT_LENGTH, indexOrLength))

        if (firstSpaceIndex > 0) {
          setFourthPart(parts[1].substring(firstSpaceIndex, parts[1].length))
        }
      }
    }
  }, [props.children])

  return (
    <>
      <span>
        {firstPart}
        {secondPart && (
          <>
            <span className='opacity-40 font-light'>.{secondPart}</span>
            <span className='opacity-40 font-light'>{thirdPart}</span>
          </>
        )}{' '}
        {fourthPart}
      </span>
    </>
  )
}
