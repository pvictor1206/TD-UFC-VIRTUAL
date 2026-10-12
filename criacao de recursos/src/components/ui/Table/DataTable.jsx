import React from 'react';

const DataTable = ({ headers = [], data = [], title }) => {
  return (
    <div className="w-full my-8 overflow-hidden rounded-[6px] overflow-hidden text-ink">
      {title && (
        <div className="px-2 py-3">
          <h3 className="text-lg font-bold text-ink">{title}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-lav text-ink">
              {headers.map((header, index) => (
                <th key={index} className="px-5 py-3 text-sm font-bold uppercase tracking-wide text-center">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-lav-soft">
            {data.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className={rowIndex % 2 === 0 ? 'bg-lav-soft' : 'bg-lav-mid'}
              >
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-5 py-3 text-sm text-ink text-center">
                    {cell}
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

export default DataTable;
