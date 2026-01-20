// ============================================================================
// Table Component - CloudPOS
// ============================================================================
import { tableColors, tokens } from '../../config/colors';

const Table = ({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
  striped = false,
  hoverable = true,
  compact = false,
}) => {
  // ── Cell Padding ──────────────────────────────────────────────────────────
  const cellPadding = compact ? 'px-4 py-2' : 'px-6 py-4';
  const headerPadding = compact ? 'px-4 py-2' : 'px-6 py-3';

  // ── Loading State ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className={`overflow-hidden rounded-xl ${tableColors.wrapper}`}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={tableColors.header}>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`${headerPadding} text-left text-xs font-semibold uppercase tracking-wider`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {[1, 2, 3].map((row) => (
              <tr key={row}>
                {columns.map((_, index) => (
                  <td key={index} className={cellPadding}>
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // ── Empty State ───────────────────────────────────────────────────────────
  if (!data || data.length === 0) {
    return (
      <div className={`overflow-hidden rounded-xl ${tableColors.wrapper}`}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={tableColors.header}>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`${headerPadding} text-left text-xs font-semibold uppercase tracking-wider`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
        </table>
        <div className="flex flex-col items-center justify-center py-12 bg-white">
          <svg
            className="w-12 h-12 text-gray-300 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p className={tokens.text.muted}>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  // ── Data Table ────────────────────────────────────────────────────────────
  return (
    <div className={`overflow-hidden rounded-xl ${tableColors.wrapper}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={tableColors.header}>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`
                    ${headerPadding}
                    text-left text-xs font-semibold uppercase tracking-wider
                    ${column.className || ''}
                  `}
                  style={{ width: column.width }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                onClick={() => onRowClick && onRowClick(row)}
                className={`
                  ${striped && rowIndex % 2 === 1 ? tableColors.rowAlt : tableColors.rowDefault}
                  ${hoverable ? 'hover:bg-gray-50' : ''}
                  ${onRowClick ? 'cursor-pointer' : ''}
                  transition-colors
                `}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={`
                      ${cellPadding}
                      text-sm ${tokens.text.primary}
                      ${column.cellClassName || ''}
                    `}
                  >
                    {column.render
                      ? column.render(row[column.accessor], row, rowIndex)
                      : row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
