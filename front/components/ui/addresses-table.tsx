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
import { Address } from 'shared';
import styles from './table.module.css';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

interface AddressesTableProps {
  columns: Column[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>[];
  itemsPerPage?: number;
  // eslint-disable-next-line no-unused-vars
  onDelete?: (_row: Address) => void;
}

export default function AddressesTable({
  columns,
  data,
  itemsPerPage = 10,
  onDelete,
}: AddressesTableProps) {
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
    <div className="space-y-6">
      {/* Search */}
      <div className="flex items-center space-x-3">
        <Search className="text-gray-400" />
        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="max-w-sm"
        />
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        <div className={styles.tableWrapper}>
          <div className="rounded-lg border border-dune-copper shadow-md">
            <Table>
              <TableHeader>
                <TableRow className="bg-dune-deepBlue hover:bg-dune-deepBlue">
                  {columns.map((column) => (
                    <TableHead key={column.key} className="font-semibold text-dune-offWhite">
                      <div
                        className="flex items-center space-x-1 cursor-pointer transition-transform transform hover:text-dune-copper"
                        onClick={() => requestSort(column.key)}
                      >
                        <span className={sortConfig?.key === column.key ? 'text-dune-copper' : ''}>
                          {column.label}
                        </span>
                        {column.sortable && (
                          <Button variant="ghost" className="ml-1 h-6 w-6 p-0">
                            {sortConfig?.key === column.key ? (
                              sortConfig.direction === 'asc' ? (
                                <ChevronUp className="h-4 w-4 text-dune-copper" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-dune-copper" />
                              )
                            ) : (
                              <ChevronDown className="h-4 w-4 text-dune-dustyGray" />
                            )}
                          </Button>
                        )}
                      </div>
                    </TableHead>
                  ))}
                  <TableHead className="font-semibold text-dune-offWhite">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((row, rowIndex) => (
                    <TableRow
                      key={rowIndex}
                      className="hover:bg-dune-copper/70 transition-colors odd:bg-dune-copper/30 even:bg-dune-sand"
                    >
                      {columns.map((column) => (
                        <TableCell
                          key={column.key}
                          className="py-3 px-4 text-sm text-dune-charcoal"
                        >
                          {row[column.key]}
                        </TableCell>
                      ))}
                      <TableCell className="py-3 px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 text-gray-500">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="text-sm">
                            <DropdownMenuLabel className="text-gray-700">Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {onDelete && (
                              <DropdownMenuItem
                                onClick={() =>
                                  onDelete({ address: row.address, blockchain: row.blockchain })
                                }
                              >
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length + 1}
                      className="h-18 text-center text-dune-deepBlue"
                    >
                      No addresses found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Pagination - only show if we have data */}
      {paginatedData.length > 0 && (
        <div className="flex flex-row space-x-3 items-center justify-between py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((old) => Math.max(old - 1, 1))}
            disabled={currentPage === 1}
            className="transition-colors hover:bg-dune-offWhite border-dune-copper text-dune-deepBlue"
          >
            &lt;
          </Button>
          <p className="text-sm text-gray-500">
            Items {(currentPage - 1) * itemsPerPage + 1} -{' '}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} (out of{' '}
            {filteredData.length})
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((old) => Math.min(old + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="transition-colors hover:bg-dune-offWhite border-dune-copper text-dune-deepBlue"
          >
            &gt;
          </Button>
        </div>
      )}
    </div>
  );
}
