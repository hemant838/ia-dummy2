'use client';

import * as React from 'react';
import { ChevronDown, InfoIcon } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@workspace/ui/components/table';
import { cn } from '@workspace/ui/lib/utils';

import TabList from '~/components/admin/tabs';

`use client`;

export type BillingBreakdownTableProps = {
  lineItems?: Array<any>;
  column?: Array<any>;
  className?: string;
};

const TableFilter = (): React.JSX.Element => {
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [status, setStatus] = React.useState<string>('all_program');

  const handleSearchQueryChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSearchQuery(e.target?.value || '');
  };

  return (
    <div className="flex flex-row w-full items-center justify-between">
      <TabList
        tabItems={[
          {
            label: 'All program',
            value: 'all_program'
          },
          {
            label: 'Active program',
            value: 'active_program'
          },
          {
            label: 'Upcoming program',
            value: 'upcoming_program'
          },
          {
            label: 'Archived',
            value: 'archived'
          },
          {
            label: 'Draft',
            value: 'draft'
          }
        ]}
        onValueChange={(value: any) => {
          setStatus(value);
        }}
        value={status}
      />

      <div className="flex items-center gap-x-3">
        <Input
          placeholder="Filter lines..."
          value={searchQuery}
          className="max-h-[40px] w-[300px]"
          onChange={handleSearchQueryChange}
        />

        <Button
          variant="outline"
          className="gap-x-4 font-medium text-secondary-foreground max-h-[40px]"
        >
          <span>Columns</span>

          <span>
            <ChevronDown className="size-5" />
          </span>
        </Button>
      </div>
    </div>
  );
};

export function RootTable({
  lineItems = [],
  column = [],
  className,
  ...other
}: BillingBreakdownTableProps): React.JSX.Element {
  return (
    <div className="w-full relative space-y-4">
      <div className="w-full space-y-3">
        <TableFilter />
        <Table
          wrapperClassName="border border-border rounded-lg overflow-y-auto max-h-[526px] bg-white"
          className={cn('w-full', className)}
          {...other}
        >
          <TableHeader className="sticky top-0 bg-gray-50 z-10 w-full">
            <TableRow className="border-b hover:bg-inherit bg-gray-50">
              {column.map((item: any, index: number) => {
                return (
                  <TableHead
                    key={`${item?.label}_${index}`}
                    className={cn(
                      'max-w-[200px] h-11 truncate !text-gray-500 !text-sm text-left font-medium text-inherit px-4',
                      index !== column.length - 1 ? 'border-r' : ''
                    )}
                  >
                    {item?.label}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>

          <TableBody className="bg-white text-foreground text-sm overflow-y-auto w-full">
            {lineItems.map((item, index) => (
              <TableRow
                key={index}
                className="border-b hover:bg-inherit font-normal h-12"
              >
                <TableCell className="px-4 max-w-[200px] truncate">
                  {item?.programTitle}
                </TableCell>
                <TableCell className="px-4 text-left">
                  {item?.startDate}
                </TableCell>
                <TableCell className="px-4 text-left">
                  {item?.endDate}
                </TableCell>
                <TableCell className="px-4 text-left">
                  {item?.applicationNo}
                </TableCell>
                <TableCell className="px-4 text-left">{item?.status}</TableCell>
                <TableCell className="px-4 text-left">{/*  */}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="w-full flex items-center justify-between">
        <span className="text-muted-foreground text-sm">
          0 of {lineItems.length} row(s) selected.
        </span>

        <div className="flex items-center gap-x-3">
          <Button
            variant="outline"
            size="sm"
            className="gap-x-4 font-normal text-sm text-foreground h-9 bg-white"
          >
            Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="gap-x-4 font-normal text-sm text-foreground h-9 bg-white"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
