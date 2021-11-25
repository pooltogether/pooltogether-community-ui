import React from 'react'
import classnames from 'classnames'

export const BasicTable = (props) => {
  const { nestedTable, tableInstance, rowClassName, noHeader, headerClassName } = props

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance

  let className = 'table table-fixed w-full align-top'

  return (
    <>
      <table {...getTableProps()} className={className}>
        {!noHeader && (
          <thead className={classnames('w-full', headerClassName)}>
            {headerGroups.map((headerGroup, index) => {
              return (
                <tr
                  key={`header-group-${index}`}
                  {...headerGroup.getHeaderGroupProps()}
                  style={nestedTable ? { background: 'none' } : {}}
                  className='tr'
                >
                  {headerGroup.headers.map((column) => {
                    return (
                      <th
                        key={`column-${column.id}`}
                        {...column.getHeaderProps([
                          {
                            className: `th ${column.className} ${column.headerClassName}`,
                            style: column.style
                          }
                        ])}
                      >
                        {column.render('Header')}
                      </th>
                    )
                  })}
                </tr>
              )
            })}
          </thead>
        )}
        <tbody className='w-full' {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row)

            return (
              <tr
                key={`row-${row.id}`}
                {...row.getRowProps()}
                className={classnames('tr', rowClassName)}
              >
                {row.cells.map((cell, index) => {
                  return (
                    <td
                      key={`row-${row.id}-cell-${index}`}
                      className='td'
                      {...cell.getCellProps([
                        {
                          className: `td ${cell.column.className}`,
                          style: cell.column.style
                        }
                      ])}
                    >
                      {cell.render('Cell')}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

BasicTable.defaultProps = {
  rowClassName: '',
  noHeader: false
}
