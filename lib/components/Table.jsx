import classnames from 'classnames'
import React from 'react'

export const Table = (props) => {
  const { headers, rows, className } = props

  return (
    <table className={className}>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th
              className={classnames('text-left', {
                'pl-8': index > 0
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
    className={classnames('text-left', {
      'pl-8': !props.first
    })}
  >
    {props.children}
  </td>
)
