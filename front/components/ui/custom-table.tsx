'use client';

import React, { useCallback, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { Button } from './button';
import { Input } from './input';
import { ChevronDown, ChevronUp, MoreHorizontal, Search } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

interface CustomTableProps {
  columns: Column[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>[];
  itemsPerPage?: number;
}

export default function CustomTable({ columns, data, itemsPerPage = 10 }: CustomTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const sortedData = React.useMemo(() => {
    const sortableItems = [...data];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const filteredData = sortedData.filter((item) =>
    Object.values(item).some(
      (value) => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, []);

  return (
    <div className="space-y-6 ">
      {/* Recherche */}
      <div className="flex items-center space-x-3">
        <Search className="text-gray-400" />
        <Input
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="max-w-sm"
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border shadow-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              {columns.map((column) => (
                <TableHead key={column.key} className="font-semibold text-gray-700">
                  <div className="flex items-center space-x-1">
                    {column.label}
                    {column.sortable && (
                      <Button
                        variant="ghost"
                        onClick={() => requestSort(column.key)}
                        className="ml-1 h-6 w-6 p-0 transition-transform transform"
                      >
                        {sortConfig?.key === column.key ? (
                          sortConfig.direction === 'asc' ? (
                            <ChevronUp className="h-4 w-4 text-blue-500" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-blue-500" />
                          )
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    )}
                  </div>
                </TableHead>
              ))}
              <TableHead className="font-semibold text-gray-700">Actions</TableHead>
            </TableRow>
          </TableHeader>

          {/* Données */}
          <TableBody>
            {paginatedData.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className="hover:bg-gray-100 transition-colors odd:bg-white even:bg-gray-50"
              >
                {columns.map((column) => (
                  <TableCell key={column.key} className="py-3 px-4 text-sm text-gray-800">
                    {row[column.key]}
                  </TableCell>
                ))}
                <TableCell className="py-3 px-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 text-gray-500">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="text-sm">
                      <DropdownMenuLabel className="text-gray-700">Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                      <DropdownMenuItem>Modifier</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-row space-x-3 items-center justify-between py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((old) => Math.max(old - 1, 1))}
          disabled={currentPage === 1}
          className="transition-colors hover:bg-gray-200"
        >
          &lt;
        </Button>
        <p className="text-sm text-gray-500">
          Items {(currentPage - 1) * itemsPerPage + 1} -{' '}
          {Math.min(currentPage * itemsPerPage, filteredData.length)} (out of {filteredData.length})
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((old) => Math.min(old + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="transition-colors hover:bg-gray-200"
        >
          &gt;
        </Button>
      </div>
    </div>
  );
}
