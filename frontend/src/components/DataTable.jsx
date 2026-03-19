function DataTable({ columns, data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-zinc-950/40 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-8 text-center shadow-lg">
        <p className="text-stone-300 font-medium text-lg drop-shadow-sm">No data found.</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950/40 backdrop-blur-xl border border-zinc-700/50 rounded-2xl shadow-lg overflow-hidden transition-all">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-900/60 border-b border-zinc-700/50 text-stone-300 uppercase text-xs font-bold tracking-wider">
              {columns.map((column) => (
                <th key={column.key} className="px-6 py-4 whitespace-nowrap">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-700/50">
            {data.map((row, index) => (
              <tr 
                key={row.id || index}
                className="hover:bg-zinc-800/40 transition-colors duration-200"
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-200">
                    {column.render
                      ? column.render(row)
                      : row[column.key] !== undefined && row[column.key] !== null
                      ? row[column.key]
                      : "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;