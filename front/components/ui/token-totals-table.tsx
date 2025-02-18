import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';
import { Address } from 'shared';
import styles from './table.module.css';
import { Button } from './button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface TokenTotalsTableProps {
  addresses: Address[];
}

interface TokenTotal {
  tokenSymbol: string;
  tokenName: string;
  totalAmount: number;
  usdValue: number;
  totalUsdValue: number;
  [key: string]: string | number; // Add index signature for sorting
}

interface Column {
  key: string;
  label: string;
  sortable: boolean;
}

export default function TokenTotalsTable({ addresses }: TokenTotalsTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(
    null,
  );

  const columns: Column[] = [
    { key: 'tokenSymbol', label: 'Token', sortable: true },
    { key: 'totalAmount', label: 'Total Amount', sortable: true },
    { key: 'usdValue', label: 'Price', sortable: true },
    { key: 'totalUsdValue', label: 'Total Value', sortable: true },
  ];

  // Calculate totals
  const tokenTotals = React.useMemo(() => {
    const totals = new Map<string, TokenTotal>();

    addresses.forEach((address) => {
      address.addressContent?.forEach((token) => {
        const existing = totals.get(token.tokenSymbol);
        if (existing) {
          existing.totalAmount += token.amount;
          existing.totalUsdValue += token.totalUsdValue;
        } else {
          totals.set(token.tokenSymbol, {
            tokenSymbol: token.tokenSymbol,
            tokenName: token.tokenName,
            totalAmount: token.amount,
            usdValue: token.usdValue,
            totalUsdValue: token.totalUsdValue,
          });
        }
      });
    });

    return Array.from(totals.values());
  }, [addresses]);

  // Sort data
  const sortedData = React.useMemo(() => {
    const sortableItems = [...tokenTotals];
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
  }, [tokenTotals, sortConfig]);

  const totalBalance = React.useMemo(() => {
    return sortedData.reduce((sum, token) => sum + token.totalUsdValue, 0);
  }, [sortedData]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
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
              {sortedData.map((token) => (
                <TableRow
                  key={token.tokenSymbol}
                  className="hover:bg-dune-copper/70 transition-colors odd:bg-dune-copper/30 even:bg-dune-sand"
                >
                  <TableCell className="py-3 px-4 text-sm text-dune-charcoal">
                    {token.tokenSymbol}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-sm text-dune-charcoal">
                    {token.totalAmount.toFixed(2)}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-sm text-dune-charcoal">
                    ${token.usdValue.toFixed(2)}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-sm text-dune-charcoal">
                    ${token.totalUsdValue.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-dune-deepBlue hover:bg-dune-deepBlue">
                <TableCell colSpan={3} className="py-3 px-4 text-sm font-bold text-dune-offWhite">
                  Total Balance
                </TableCell>
                <TableCell className="py-3 px-4 text-sm font-bold text-dune-offWhite">
                  ${totalBalance.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
