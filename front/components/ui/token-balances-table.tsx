'use client';

import React, { useCallback, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';
import { Input } from './input';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { Button } from './button';
import { Address } from 'shared';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import styles from './table.module.css';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

interface TokenBalancesTableProps {
  addresses: Address[];
  itemsPerPage?: number;
}

interface TokenTableData {
  addressName: string;
  walletAddress: string;
  tokenSymbol: string;
  tokenName: string;
  amount: number;
  usdValue: number;
  totalUsdValue: number;
  lastUpdated: Date;
  mintAddress: string;
  [key: string]: string | number | Date; // Add index signature
}

export default function TokenBalancesTable({
  addresses,
  itemsPerPage = 10,
}: TokenBalancesTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const columns: Column[] = [
    { key: 'addressName', label: 'Wallet', sortable: true },
    { key: 'tokenSymbol', label: 'Token', sortable: true },
    { key: 'amount', label: 'Balance', sortable: true },
    { key: 'usdPrice', label: 'Price', sortable: true },
    { key: 'totalUsdValue', label: 'Total Value', sortable: true },
  ];

  // Flatten addresses and their tokens into a single array
  const allTokens = addresses.flatMap((address) =>
    (address.addressContent || []).map((token) => ({
      ...token,
      walletAddress: address.address,
    })),
  );

  const sortedData = React.useMemo(() => {
    const sortableItems = [...allTokens] as TokenTableData[];
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
  }, [allTokens, sortConfig]);

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
          placeholder="Search tokens/wallets..."
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((token, index) => (
                    <TableRow
                      key={`${token.walletAddress}-${token.tokenSymbol}-${index}`}
                      className="hover:bg-dune-copper/70 transition-colors odd:bg-dune-copper/30 even:bg-dune-sand"
                    >
                      <TableCell className="py-3 px-4 text-sm text-dune-charcoal">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="hover:text-dune-copper transition-colors">
                              {`${token.walletAddress.slice(0, 3)}...${token.walletAddress.slice(-3)}`}
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{token.walletAddress}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell className="py-3 px-4 text-sm text-dune-charcoal">
                        {token.tokenSymbol}
                      </TableCell>
                      <TableCell className="py-3 px-4 text-sm text-dune-charcoal">
                        {token.amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="py-3 px-4 text-sm text-dune-charcoal">
                        ${token.usdValue.toFixed(2)}
                      </TableCell>
                      <TableCell className="py-3 px-4 text-sm text-dune-charcoal">
                        ${token.totalUsdValue.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-18 text-center text-dune-deepBlue"
                    >
                      No valid tokens in your addresses
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
