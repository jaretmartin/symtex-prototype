/**
 * Table Component Suite
 *
 * A comprehensive table system including primitive components (shadcn-style)
 * and an enhanced DataTable with sorting, selection, and pagination.
 */

import * as React from 'react';
import { forwardRef, useState, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Check,
  Minus,
} from 'lucide-react';

// =============================================================================
// PRIMITIVE TABLE COMPONENTS
// =============================================================================

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {}

const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref}
        className={cn('w-full caption-bottom text-sm', className)}
        {...props}
      />
    </div>
  )
);
Table.displayName = 'Table';

export interface TableHeaderProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {}

const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
  )
);
TableHeader.displayName = 'TableHeader';

export interface TableBodyProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {}

const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  )
);
TableBody.displayName = 'TableBody';

export interface TableFooterProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {}

const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={cn(
        'border-t bg-muted/50 font-medium [&>tr]:last:border-b-0',
        className
      )}
      {...props}
    />
  )
);
TableFooter.displayName = 'TableFooter';

export interface TableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
}

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, selected, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'border-b border-border transition-colors hover:bg-muted/50',
        selected && 'bg-muted',
        className
      )}
      data-state={selected ? 'selected' : undefined}
      {...props}
    />
  )
);
TableRow.displayName = 'TableRow';

export interface TableHeadProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | null;
  onSort?: () => void;
}

const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, sortable, sortDirection, onSort, children, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        'h-12 px-4 text-left align-middle font-medium text-muted-foreground',
        '[&:has([role=checkbox])]:pr-0',
        sortable && 'cursor-pointer select-none hover:text-foreground',
        className
      )}
      onClick={sortable ? onSort : undefined}
      aria-sort={
        sortDirection === 'asc'
          ? 'ascending'
          : sortDirection === 'desc'
            ? 'descending'
            : undefined
      }
      {...props}
    >
      {sortable ? (
        <div className="flex items-center gap-2">
          {children}
          <span className="inline-flex">
            {sortDirection === 'asc' ? (
              <ChevronUp className="h-4 w-4" />
            ) : sortDirection === 'desc' ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronsUpDown className="h-4 w-4 opacity-50" />
            )}
          </span>
        </div>
      ) : (
        children
      )}
    </th>
  )
);
TableHead.displayName = 'TableHead';

export interface TableCellProps
  extends React.TdHTMLAttributes<HTMLTableCellElement> {}

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        'p-4 align-middle [&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    />
  )
);
TableCell.displayName = 'TableCell';

export interface TableCaptionProps
  extends React.HTMLAttributes<HTMLTableCaptionElement> {}

const TableCaption = forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  ({ className, ...props }, ref) => (
    <caption
      ref={ref}
      className={cn('mt-4 text-sm text-muted-foreground', className)}
      {...props}
    />
  )
);
TableCaption.displayName = 'TableCaption';

// =============================================================================
// CHECKBOX COMPONENT (Internal)
// =============================================================================

interface CheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  'aria-label'?: string;
}

function Checkbox({
  checked,
  indeterminate,
  onChange,
  className,
  'aria-label': ariaLabel,
}: CheckboxProps): JSX.Element {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={cn(
        'h-4 w-4 shrink-0 rounded border border-border',
        'ring-offset-background transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        (checked || indeterminate) &&
          'bg-symtex-primary border-symtex-primary text-white',
        className
      )}
    >
      {indeterminate ? (
        <Minus className="h-3 w-3 mx-auto" />
      ) : checked ? (
        <Check className="h-3 w-3 mx-auto" />
      ) : null}
    </button>
  );
}

// =============================================================================
// DATATABLE COMPONENT
// =============================================================================

export interface Column<T> {
  id: string;
  header: string | React.ReactNode;
  cell: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];

  // Features
  sortable?: boolean;
  selectable?: boolean;
  paginated?: boolean;
  pageSize?: number;

  // State
  selectedRows?: string[];
  onSelectionChange?: (ids: string[]) => void;

  // Empty/Loading states
  emptyState?: React.ReactNode;
  loading?: boolean;

  // Styling
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;

  // Callbacks
  onRowClick?: (row: T) => void;
}

type SortDirection = 'asc' | 'desc' | null;

function DataTable<T extends { id: string }>({
  data,
  columns,
  sortable = false,
  selectable = false,
  paginated = false,
  pageSize = 10,
  selectedRows = [],
  onSelectionChange,
  emptyState,
  loading = false,
  className,
  striped = false,
  hoverable = true,
  compact = false,
  onRowClick,
}: DataTableProps<T>): JSX.Element {
  // Sorting state
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSizeState, setPageSizeState] = useState(pageSize);

  // Handle sort click
  const handleSort = useCallback(
    (columnId: string) => {
      if (sortColumn === columnId) {
        if (sortDirection === 'asc') {
          setSortDirection('desc');
        } else if (sortDirection === 'desc') {
          setSortColumn(null);
          setSortDirection(null);
        }
      } else {
        setSortColumn(columnId);
        setSortDirection('asc');
      }
      // Reset to first page when sorting changes
      setCurrentPage(1);
    },
    [sortColumn, sortDirection]
  );

  // Sorted data
  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return data;

    return [...data].sort((a, b) => {
      const column = columns.find((c) => c.id === sortColumn);
      if (!column) return 0;

      // Get cell values - this is a simplified approach
      // In a real app, you'd want to pass a sort accessor
      const aVal = (a as Record<string, unknown>)[sortColumn];
      const bVal = (b as Record<string, unknown>)[sortColumn];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      const comparison = aVal < bVal ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortColumn, sortDirection, columns]);

  // Paginated data
  const paginatedData = useMemo(() => {
    if (!paginated) return sortedData;

    const startIndex = (currentPage - 1) * pageSizeState;
    const endIndex = startIndex + pageSizeState;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, paginated, currentPage, pageSizeState]);

  // Pagination info
  const totalPages = Math.ceil(sortedData.length / pageSizeState);
  const totalItems = sortedData.length;
  const startItem = (currentPage - 1) * pageSizeState + 1;
  const endItem = Math.min(currentPage * pageSizeState, totalItems);

  // Selection handlers
  const handleSelectAll = useCallback(() => {
    if (!onSelectionChange) return;

    const currentPageIds = paginatedData.map((row) => row.id);
    const allSelected = currentPageIds.every((id) => selectedRows.includes(id));

    if (allSelected) {
      // Deselect all on current page
      onSelectionChange(
        selectedRows.filter((id) => !currentPageIds.includes(id))
      );
    } else {
      // Select all on current page
      const newSelection = [...new Set([...selectedRows, ...currentPageIds])];
      onSelectionChange(newSelection);
    }
  }, [paginatedData, selectedRows, onSelectionChange]);

  const handleSelectRow = useCallback(
    (rowId: string) => {
      if (!onSelectionChange) return;

      if (selectedRows.includes(rowId)) {
        onSelectionChange(selectedRows.filter((id) => id !== rowId));
      } else {
        onSelectionChange([...selectedRows, rowId]);
      }
    },
    [selectedRows, onSelectionChange]
  );

  // Check if all rows on current page are selected
  const currentPageIds = paginatedData.map((row) => row.id);
  const allSelected =
    currentPageIds.length > 0 &&
    currentPageIds.every((id) => selectedRows.includes(id));
  const someSelected =
    currentPageIds.some((id) => selectedRows.includes(id)) && !allSelected;

  // Loading state
  if (loading) {
    return (
      <div className={cn('space-y-3', className)}>
        {/* Header skeleton */}
        <div className="flex items-center gap-4 p-3 bg-surface-elevated rounded-lg border border-border">
          {selectable && <Skeleton width={16} height={16} />}
          {columns.map((col) => (
            <Skeleton
              key={col.id}
              height={14}
              width={col.width || `${100 / columns.length}%`}
            />
          ))}
        </div>

        {/* Row skeletons */}
        {Array.from({ length: pageSizeState }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'flex items-center gap-4 p-4 bg-card border border-border rounded-lg',
              compact && 'p-2'
            )}
          >
            {selectable && <Skeleton width={16} height={16} />}
            {columns.map((col) => (
              <Skeleton
                key={col.id}
                height={compact ? 14 : 16}
                width={col.width || `${100 / columns.length}%`}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div className={cn('w-full', className)}>
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={false}
                    onChange={() => {}}
                    aria-label="Select all"
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead
                  key={column.id}
                  style={{ width: column.width }}
                  sortable={sortable && column.sortable}
                  sortDirection={
                    sortColumn === column.id ? sortDirection : null
                  }
                  onSort={() => handleSort(column.id)}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
        </Table>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          {emptyState || (
            <>
              <div className="text-muted-foreground mb-2">No data available</div>
              <div className="text-sm text-muted-foreground/60">
                There are no items to display at this time.
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      <Table>
        <TableHeader>
          <TableRow
            className={cn(
              'bg-surface-elevated hover:bg-surface-elevated',
              compact && '[&_th]:h-10 [&_th]:px-3'
            )}
          >
            {selectable && (
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={handleSelectAll}
                  aria-label="Select all rows"
                />
              </TableHead>
            )}
            {columns.map((column) => (
              <TableHead
                key={column.id}
                style={{ width: column.width }}
                sortable={sortable && column.sortable !== false}
                sortDirection={sortColumn === column.id ? sortDirection : null}
                onSort={
                  sortable && column.sortable !== false
                    ? () => handleSort(column.id)
                    : undefined
                }
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((row, rowIndex) => {
            const isSelected = selectedRows.includes(row.id);
            return (
              <TableRow
                key={row.id}
                selected={isSelected}
                className={cn(
                  hoverable && 'hover:bg-muted/50',
                  striped && rowIndex % 2 === 1 && 'bg-muted/20',
                  compact && '[&_td]:p-2',
                  onRowClick && 'cursor-pointer'
                )}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {selectable && (
                  <TableCell
                    className="w-[50px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handleSelectRow(row.id)}
                      aria-label={`Select row ${row.id}`}
                    />
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell key={column.id} style={{ width: column.width }}>
                    {column.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Pagination */}
      {paginated && totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-card/50">
          <div className="flex items-center gap-4">
            {/* Page size selector */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Rows per page:</span>
              <select
                value={pageSizeState}
                onChange={(e) => {
                  setPageSizeState(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-card border border-border rounded-md px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {[5, 10, 20, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* Selection count */}
            {selectable && selectedRows.length > 0 && (
              <div className="text-sm text-muted-foreground">
                {selectedRows.length} of {totalItems} row(s) selected
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Page info */}
            <span className="text-sm text-muted-foreground">
              {startItem}-{endItem} of {totalItems}
            </span>

            {/* Navigation buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className={cn(
                  'p-1.5 rounded-md transition-colors',
                  'hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                )}
                aria-label="Go to first page"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={cn(
                  'p-1.5 rounded-md transition-colors',
                  'hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                )}
                aria-label="Go to previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Page number display */}
              <span className="px-3 py-1 text-sm">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className={cn(
                  'p-1.5 rounded-md transition-colors',
                  'hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                )}
                aria-label="Go to next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className={cn(
                  'p-1.5 rounded-md transition-colors',
                  'hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                )}
                aria-label="Go to last page"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  DataTable,
};
