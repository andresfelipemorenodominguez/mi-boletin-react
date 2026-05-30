"use client";

import React, { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, Inbox } from "lucide-react";

export interface ColumnDef<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  searchPlaceholder?: string;
  searchableKeys?: (keyof T)[];
  itemsPerPage?: number;
}

export function DataTable<T>({
  data,
  columns,
  searchPlaceholder = "Buscar...",
  searchableKeys,
  itemsPerPage = 10
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lowercasedTerm = searchTerm.toLowerCase();
    return data.filter((item) => {
      if (searchableKeys) {
        return searchableKeys.some((key) => {
          const value = item[key];
          return value && String(value).toLowerCase().includes(lowercasedTerm);
        });
      }
      return Object.values(item as Record<string, unknown>).some(
        (value) => value && String(value).toLowerCase().includes(lowercasedTerm)
      );
    });
  }, [data, searchTerm, searchableKeys]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-800 overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-slate-100 dark:border-gray-800 flex items-center justify-between gap-4 flex-wrap bg-white dark:bg-gray-900">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white dark:focus:bg-gray-800 text-sm text-slate-800 dark:text-gray-200 placeholder-slate-400 dark:placeholder-gray-500 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 dark:text-gray-300">
          <thead className="bg-slate-50 dark:bg-gray-800/60 text-xs uppercase text-slate-500 dark:text-gray-400 font-semibold border-b border-slate-200 dark:border-gray-800 tracking-wide">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="px-6 py-3.5">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
            {paginatedData.length > 0 ? (
              paginatedData.map((item, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                      {col.cell
                        ? col.cell(item)
                        : col.accessorKey
                          ? String(item[col.accessorKey] || "")
                          : ""}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400 dark:text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <Inbox className="w-12 h-12 text-slate-300 dark:text-gray-600 mb-3" />
                    <p>No se encontraron resultados.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-100 dark:border-gray-800 flex items-center justify-between text-sm bg-white dark:bg-gray-900">
          <span className="text-slate-500 dark:text-gray-400">
            Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredData.length)} de {filteredData.length} resultados
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-gray-800 hover:border-slate-300 transition-colors text-slate-600 dark:text-gray-400"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-medium text-slate-700 dark:text-gray-300 bg-slate-100 dark:bg-gray-800 rounded-lg text-xs">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-gray-800 hover:border-slate-300 transition-colors text-slate-600 dark:text-gray-400"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
