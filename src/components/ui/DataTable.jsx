export default function DataTable({ columns, rows, rowKey = 'id' }) {
  return (
    <div className="overflow-x-auto rounded-md border border-line bg-panel">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-ink-50/60">
            {columns.map((col) => (
              <th key={col.key} className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-steel">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-steel">
                No inspections match the current filters.
              </td>
            </tr>
          )}
          {rows.map((row) => (
            <tr key={row[rowKey]} className="border-b border-line last:border-0 hover:bg-ink-50/40">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 align-middle text-ink-700">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
