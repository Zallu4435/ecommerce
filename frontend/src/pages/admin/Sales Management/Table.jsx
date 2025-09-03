import React from "react";

const Table = ({ data, columns, title }) => (
  <div className="bg-yellow-50 dark:bg-gray-800 rounded-lg shadow mb-8">
    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h2>
    </div>
    <div className="overflow-x-auto">
      <div className="min-h-[200px] max-h-[400px] scrollbar-hidden overflow-y-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-yellow-100 dark:bg-gray-700 text-left">
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {Array.isArray(data) && data.length > 0 ? (
              data.map((row, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {Object.values(row).map((cell, idx) => (
                    <td
                      key={idx}
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default Table;
