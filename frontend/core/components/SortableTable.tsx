'use client';

import { useState, ReactNode } from 'react';

interface SortConfig<Record> {
  key: keyof Record;
  direction: 'ascending' | 'descending';
}

interface SortableTableProps<Record> {
  records: Record[];
  columns: { key: keyof Record; label: string; widthClass?: string }[]; // Added widthClass for custom widths
  filters?: JSX.Element;
  className?: string;
  filterRecords?: (records: Record[]) => Record[];
}

export default function SortableTable<Record extends { id: string }>({
  records,
  columns,
  filters,
  className,
  filterRecords,
}: SortableTableProps<Record>) {
  const [sortConfig, setSortConfig] = useState<SortConfig<Record>>({
    key: columns[0].key,
    direction: 'ascending',
  });

  // Apply filters if provided
  const filteredRecords = filterRecords ? filterRecords(records) : records;

  // Sort records
  const sortedRecords = [...filteredRecords].sort((a, b) => {
  const aValue = a[sortConfig.key];
  const bValue = b[sortConfig.key];

  // case-insensitive sorting for strings
  const aFormatted = typeof aValue === 'string' ? aValue.toLowerCase() : aValue;
  const bFormatted = typeof bValue === 'string' ? bValue.toLowerCase() : bValue;

  if (aFormatted < bFormatted) {
    return sortConfig.direction === 'ascending' ? -1 : 1;
  }
  if (aFormatted > bFormatted) {
    return sortConfig.direction === 'ascending' ? 1 : -1;
  }
  return 0;
});



  const handleSort = (key: keyof Record) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getStatusClassName = (status: string) => {
    switch (status) {
      case 'Enabled':
        return 'govuk-tag govuk-tag--green';
      case 'Pending':
        return 'govuk-tag govuk-tag--yellow';
      case 'Disabled':
        return 'govuk-tag govuk-tag--grey';
      default:
        return 'govuk-tag';
    }
  };

  const renderCellContent = (
    key: keyof Record,
    value: Record[keyof Record],
  ): ReactNode => {
    if (key === 'status') {
      return (
        <span className={getStatusClassName(value as string)}>
          {String(value)}
        </span>
      );
    }

    if (key === 'id' && value !== 'N/A') {
      // Render 'id' as a clickable link with the govuk-link class
      return (
        <a
          className="govuk-link"
          href={`/dashboard/account-management/change-user-details/${value}`}
        >
          {String(value)}
        </a>
      );
    }

    return String(value); // Default rendering for other fields
  };

  return (
    <div>
      {filters && <div>{filters}</div>}
      <table className={className}>
        <thead className="govuk-table__head">
          <tr className="govuk-table__row">
            {columns.map(column => (
              <th
                key={column.key as string}
                scope="col"
                className={`govuk-table__header ${column.widthClass || ''}`}
              >
                <a
                  href="#"
                  className="govuk-link govuk-link--custom-blue"
                  onClick={() => handleSort(column.key)}
                >
                  {column.label}
                  {sortConfig.key === column.key &&
                    (sortConfig.direction === 'ascending' ? ' ▲' : ' ▼')}
                </a>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="govuk-table__body">
          {sortedRecords.map(record => (
            <tr className="govuk-table__row" key={record.id}>
              {columns.map(column => (
                <td key={column.key as string} className="govuk-table__cell">
                  {renderCellContent(column.key, record[column.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
