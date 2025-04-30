'use client';

import * as React from 'react';
import Link from 'next/link';
import { Copy, EllipsisVertical, ExternalLink, Filter } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormProvider
} from '@workspace/ui/components/form';
import { MultiSelect } from '@workspace/ui/components/multi-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@workspace/ui/components/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@workspace/ui/components/table';
import { cn } from '@workspace/ui/lib/utils';

import { SearchableSelect } from '~/components/admin/form';
import SideDrawer from '~/components/admin/SideDrawer';
import TabList from '~/components/admin/tabs';
import { useZodForm } from '~/hooks/use-zod-form';
import { getRandomTagColor } from '~/lib/generate-random-tag-color';
import { copyToClipboard, getNestedValue } from '~/lib/helper';
import {
  programFilterSchema,
  type ProgramFilterSchema
} from '~/schemas/filter/program-filter-schema';
import { TableFilter as TableFilterType } from '~/types/table';

const CellSelect = ({ options = [], value }: any) => {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [cellValue, setCellValue] = React.useState(value);
  const [selectedColors, setSelectedColors] = React.useState<any>({
    bg: '',
    border: ''
  });

  React.useEffect(() => {
    const color = options.find((opt: any) => opt.value === value)?.color;
    setSelectedColors(color);
  }, []);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className="hover:bg-transparent px-0 py-0"
        onClick={() => {
          setShowDropdown(!showDropdown);
        }}
      >
        <span
          className={`px-2 py-1 border ${selectedColors.bg} ${selectedColors.border} text-gray-500 rounded-[6px]`}
        >
          {cellValue}
        </span>
      </Button>

      {showDropdown && (
        <SearchableSelect
          data={options}
          onSelectChange={(selected: any) => {
            setCellValue(selected?.label);
            if (selected?.color) {
              setSelectedColors(selected?.color);
            }

            setShowDropdown(false);
          }}
        />
      )}
    </div>
  );
};

function CellRenderer({ value, type = 'text', options = [] }: any) {
  if (!value) {
    return (
      <div>
        <span>-</span>
      </div>
    );
  }

  switch (type) {
    case 'input':
      return (
        <div>
          <input
            type="text"
            defaultValue={value}
            className="border p-1 rounded"
          />
        </div>
      );
    case 'date':
      return (
        <div>
          <input
            type="date"
            defaultValue={value}
            className="border p-1 rounded"
          />
        </div>
      );
    case 'select': {
      return (
        <CellSelect
          options={options}
          value={value}
        />
      );
    }
    case 'tag': {
      const { bg, border } = React.useMemo(() => getRandomTagColor(), []);

      return (
        <span
          className={`px-2 py-1 ${bg} ${border} text-gray-500 rounded-[6px]`}
        >
          {value}
        </span>
      );
    }
    case 'email':
      return (
        <div className="flex items-center gap-x-3">
          <Link
            href={`mailto:${value}`}
            className="text-indigo-400 no-underline"
          >
            {value}
          </Link>

          <Button
            variant="outline"
            className="w-6 h-6 text-slate-800 px-0 py-0"
            style={{
              boxShadow:
                '#0000000d -2px -1px 4px 0px, #00000005 -2px 4px 4px 0px'
            }}
            onClick={() => {
              copyToClipboard(value);
            }}
          >
            <Copy size={14} />
          </Button>
        </div>
      );
    case 'url':
      return (
        <div className="flex items-center gap-x-3">
          <Link
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 underline"
          >
            {value}
          </Link>

          <Button
            variant="outline"
            className="w-6 h-6 text-slate-800 px-0 py-0"
            style={{
              boxShadow:
                '#0000000d -2px -1px 4px 0px, #00000005 -2px 4px 4px 0px'
            }}
            onClick={() => {
              window.open(`${value}`, '_blank');
            }}
          >
            <ExternalLink size={14} />
          </Button>
        </div>
      );
    case 'phone':
      return (
        <div>
          <Link
            href={`tel:${value}`}
            className="text-[#272833] no-underline"
          >
            {value}
          </Link>
        </div>
      );
    case 'text':
    default:
      return <span className="text-slate-800">{value}</span>;
  }
}

const TableFilter = ({
  tabFilters = [],
  handleDrawerOpenChange,
  showTabFilters = false,
  handleTabChange = () => {}
}: any): React.JSX.Element => {
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [status, setStatus] = React.useState<string>(
    tabFilters[0]?.value || ''
  );

  // const handleSearchQueryChange = (
  //   e: React.ChangeEvent<HTMLInputElement>
  // ): void => {
  //   setSearchQuery(e.target?.value || '');
  // };

  return (
    <div className="flex flex-row w-full items-center justify-between">
      <div>
        {showTabFilters && (
          <TabList
            tabItems={tabFilters}
            onValueChange={(value: any) => {
              setStatus(value);
              handleTabChange(value);
            }}
            value={status}
          />
        )}
      </div>

      <div className="flex items-center gap-x-3">
        {/* <Input
          placeholder="Filter lines..."
          value={searchQuery}
          className="max-h-[40px] w-[300px]"
          onChange={handleSearchQueryChange}
        /> */}

        <Button
          variant="outline"
          className="gap-x-2 font-medium text-secondary-foreground max-h-[40px]"
          onClick={() => {
            handleDrawerOpenChange(true);
          }}
        >
          <span>
            <Filter className="size-5" />
          </span>
          <span>Filter</span>
        </Button>
      </div>
    </div>
  );
};

export function RootTable({
  showTabFilters = false,
  lineItems = [],
  column = [],
  className,
  totalPages,
  currentPage = 1,
  hasPreviousPage = false,
  hasNextPage = false,
  handleNextPage = () => {},
  handlePrevPage = () => {},
  tabFilters = [],
  handleTabChange = () => {},
  ...other
}: TableFilterType): React.JSX.Element {
  const [showFilterDrawer, setShowFilterDrawer] =
    React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const methods = useZodForm({
    // We pass through the values and do not validate on the client-side
    // Reason: Would be bad UX to validate fields, unexpected behavior at this spot
    schema: programFilterSchema,
    mode: 'onSubmit',
    defaultValues: {
      thesis: '',
      stage: '',
      startupSource: '',
      poc: '',
      createdBy: '',
      createdAt: ''
    }
  });

  const canSubmit = !isLoading && !methods.formState.isSubmitting;

  const onSubmit = async (values: ProgramFilterSchema): Promise<void> => {
    if (!canSubmit) {
      return;
    }

    setIsLoading(true);

    console.log('form', values);
    // main logic

    setIsLoading(false);
  };

  const handleDrawerOpenChange = (open: any): void => {
    setShowFilterDrawer(!showFilterDrawer);
  };

  return (
    <div className="w-full relative space-y-4">
      <div className="w-full space-y-3">
        <TableFilter
          showTabFilters={showTabFilters}
          handleDrawerOpenChange={handleDrawerOpenChange}
          tabFilters={tabFilters}
          handleTabChange={handleTabChange}
        />
        <Table
          wrapperClassName="border border-border rounded-lg overflow-y-auto max-h-[526px] bg-white min-h-[320px]"
          className={cn('w-full', className)}
          {...other}
        >
          <TableHeader className="sticky top-0 bg-gray-50 z-1 w-full">
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
                {column.map((col, colIndex) => {
                  const value = getNestedValue(item, col.accessorKey);

                  if (col.accessorKey === 'actions') {
                    return (
                      <TableCell
                        key={`cell_${col.accessorKey}_${colIndex}`}
                        className="px-4 max-w-[42px] truncate"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="font-normal w-[42px] text-sm text-gray-400 h-9 bg-white float-right"
                        >
                          <EllipsisVertical />
                        </Button>
                      </TableCell>
                    );
                  }

                  return (
                    <TableCell
                      key={`cell_${col.accessorKey}_${colIndex}`}
                      className={`px-4 max-w-[200px] truncate text-sm text-slate-800 relative ${col.type === 'select' && col?.option?.length ? '!overflow-visible' : ''}`}
                    >
                      <CellRenderer
                        value={value}
                        type={col.type}
                        options={col.option || []}
                      />
                    </TableCell>
                  );
                })}
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
            disabled={!hasPreviousPage}
            onClick={() => {
              if (hasPreviousPage) {
                const count = currentPage - 1;
                handlePrevPage(count);
              }
            }}
          >
            Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="gap-x-4 font-normal text-sm text-foreground h-9 bg-white"
            disabled={!hasNextPage}
            onClick={() => {
              if (hasNextPage) {
                const count = currentPage + 1;
                handleNextPage(count);
              }
            }}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Side Filter Drawer */}
      <SideDrawer
        modal={{
          visible: showFilterDrawer,
          handleOpenChange: (value: any) => {
            setShowFilterDrawer(value);
          }
        }}
        title="Filter"
        renderForm={null}
        renderButtons={null}
      >
        <FormProvider {...methods}>
          <form
            className="flex flex-col gap-5"
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            {[
              {
                label: 'Thesis',
                name: 'thesis',
                type: 'multiselect',
                placeholder: 'Select created by'
              },
              {
                label: 'Evaluation Stage',
                name: 'stage',
                type: 'select',
                placeholder: 'Select created by'
              },
              {
                label: 'POC',
                name: 'poc',
                type: 'select',
                placeholder: 'Select POC'
              },
              {
                label: 'Startup Source',
                name: 'startupSource',
                type: 'select',
                placeholder: 'Select startup source'
              },
              {
                label: 'Created by',
                name: 'createdBy',
                type: 'select',
                placeholder: 'Select created by'
              },
              {
                label: 'Created at',
                name: 'createdAt',
                type: 'select',
                placeholder: 'Select created at'
              }
            ].map((item, index) => {
              if (item.type === 'multiselect') {
                return (
                  <FormField
                    key={item?.name + '_' + index}
                    control={methods.control}
                    name="thesis"
                    render={({ field }) => (
                      <FormItem className="flex flex-col space-y-1">
                        <FormLabel className="text-sm">
                          <span>{item?.label}</span>
                        </FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={[
                              {
                                label: 'Thesis 1',
                                value: 'thesis_1'
                              },
                              {
                                label: 'Thesis 2',
                                value: 'thesis_2'
                              }
                            ]}
                            selected={['thesis_1']}
                            onChange={field.onChange}
                            className="w-full"
                            placeholder="Select thesis"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              }

              return (
                <FormField
                  key={item?.name + '_' + index}
                  control={methods.control}
                  name="stage"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-1">
                      <FormLabel className="text-sm">
                        <span>{item?.label}</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          required
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={methods.formState.isSubmitting}
                        >
                          <SelectTrigger className="text-foreground">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={'item'}>Item</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            })}
          </form>
        </FormProvider>
      </SideDrawer>
    </div>
  );
}
