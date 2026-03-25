function DataTable({ columns, data }) {
  if (!data || data.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-stone-400 font-medium text-lg italic">No data found in this section.</p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10 text-stone-300 uppercase text-[10px] font-bold tracking-widest leading-none">
              {columns.map((column) => (
                <th key={column.key} className="px-6 py-5 whitespace-nowrap">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {data.map((row, index) => (
              <tr 
                key={row.id || index}
                className="hover:bg-white/[0.03] transition-colors duration-200 group"
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-300 group-hover:text-white transition-colors">
                    {column.render
                      ? column.render(row)
                      : row[column.key] !== undefined && row[column.key] !== null
                      ? row[column.key]
                      : <span className="text-stone-600">-</span>}
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