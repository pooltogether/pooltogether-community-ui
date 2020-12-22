import React from 'react'
import classnames from 'classnames'

export const Table = (props) => {
  const { headers, rows, className } = props

  return (
    <table className={className}>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th
              className={classnames('text-left text-accent-1 pb-3 text-sm font-bold', {
                'pl-2 sm:pl-12': index > 0
              })}
              key={`${index}${header}`}
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>{rows}</tbody>
    </table>
  )
}

export const RowDataCell = (props) => (
  <td
    className={classnames(
      'text-left text-base sm:text-lg pb-2',
      {
        'pl-2 sm:pl-12': !props.first
      },
      props.className
    )}
  >
    {props.children}
  </td>
)
