'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Copy,
  EllipsisVertical,
  ExternalLink,
  Filter,
  GraduationCap
} from 'lucide-react';

import { Button } from '@workspace/ui/components/button';
import { Calendar } from '@workspace/ui/components/calendar';
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
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@workspace/ui/components/popover';
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

import { SearchableSelect } from '~/components/main/form';
import SideDrawer from '~/components/main/SideDrawer';
import TabList from '~/components/main/tabs';
import { useZodForm } from '~/hooks/use-zod-form';
import {
  convertDateToISO,
  convertISOToDateString,
  formatDate
} from '~/lib/formatters';
import { getRandomTagColor } from '~/lib/generate-random-tag-color';
import { copyToClipboard, getInitials, getNestedValue } from '~/lib/helper';
import {
  programFilterSchema,
  type ProgramFilterSchema
} from '~/schemas/filter/program-filter-schema';
import { TableFilter as TableFilterType } from '~/types/table';

function getLabelFromValue(value: string, options: any[]): string | undefined {
  const match = options?.find((option) => option?.value === value);
  return match?.label;
}

const CellDate = ({ value, handleFormSubmit, readOnly }: any) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | any>(
    value ? new Date(value) : null
  );
  const [showDatePicker, setShowDatePicker] = React.useState(false);

  const handleDateChange = (date: Date | any) => {
    const formatedDate = convertDateToISO(date);

    handleFormSubmit(formatedDate);

    setSelectedDate(formatedDate);
    setShowDatePicker(false); // Close the date picker after selection
  };

  return (
    <div className="relative">
      <Popover
        open={showDatePicker}
        onOpenChange={(val) => {
          if (!readOnly) {
            setShowDatePicker(val);
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="bg-transparent hover:bg-gray-50 px-2 py-1 w-full h-fit justify-start"
          >
            <span className={`text-gray-500 rounded-[6px]`}>
              {selectedDate ? formatDate(selectedDate) : 'Select Date'}
            </span>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="center"
          className={`w-full min-w-[180px] bg-white shadow-lg border border-gray-100 rounded-lg px-2 py-1 text-xs`}
        >
          <Calendar
            mode="single"
            selected={new Date(convertISOToDateString(selectedDate))}
            defaultMonth={new Date()}
            onSelect={handleDateChange}
            classNames={{
              day_selected: `!bg-indigo-400 !border-indigo-500 !text-white !font-medium` // Highlight the selected day
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

const CellSelect = ({
  options = [],
  value,
  handleFormSubmit,
  readOnly
}: any) => {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [cellValue, setCellValue] = React.useState(value);
  const [selectedColors, setSelectedColors] = React.useState<any>({
    bg: '',
    border: ''
  });

  React.useEffect(() => {
    const color = options?.find(
      (opt: any) =>
        opt?.value?.toLowerCase() === value?.toLowerCase() ||
        opt?.label?.toLowerCase() === value?.toLowerCase()
    )?.color;
    setSelectedColors(color);
  }, []);

  return (
    <div className="relative">
      <Popover
        open={showDropdown}
        onOpenChange={(val) => {
          if (!readOnly) {
            setShowDropdown(val);
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="hover:bg-transparent px-0 py-0 w-full justify-start"
          >
            <div
              className={`capitalize min-h-[30px] min-w-[30px] px-2 py-1 border ${selectedColors?.bg} ${selectedColors?.border} text-gray-500 rounded-[6px]`}
            >
              <span>{cellValue || '-'}</span>
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="center"
          className={`w-full min-w-[180px] bg-white shadow-lg border border-gray-100 rounded-lg px-2 py-1 text-xs`}
        >
          <SearchableSelect
            data={options}
            onSelectChange={(selected: any) => {
              setCellValue(selected?.label);
              if (selected?.color) {
                setSelectedColors(selected?.color);
              }

              setShowDropdown(false);
              handleFormSubmit(selected?.value);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

const CellTagSelect = ({
  options = [],
  value,
  handleFormSubmit,
  readOnly
}: any) => {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [cellValue, setCellValue] = React.useState(value);
  const [selectedColors, setSelectedColors] = React.useState<any>({
    bg: '',
    border: ''
  });

  React.useEffect(() => {
    const color = options?.find((opt: any) => opt?.value === value)?.color;
    setSelectedColors(color);
  }, []);

  return (
    <div className="relative">
      <Popover
        open={showDropdown}
        onOpenChange={(val) => {
          if (!readOnly) {
            setShowDropdown(val);
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={`max-h-[30px] flex px-2 py-1 w-fit ${!cellValue ? 'min-w-[80px]' : ''} justify-start items-center gap-x-1 bg-gray-50 text-gray-500 hover:text-gray-500 font-normal hover:font-normal rounded-[6px]`}
          >
            <GraduationCap
              size={16}
              className="text-cyan-500"
            />
            <span className="capitalize">{cellValue || '-'}</span>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="center"
          className={`w-full min-w-[180px] bg-white shadow-lg border border-gray-100 rounded-lg px-2 py-1 text-xs`}
        >
          <SearchableSelect
            data={options}
            onSelectChange={(selected: any) => {
              setCellValue(selected?.label);
              if (selected?.color) {
                setSelectedColors(selected?.color);
              }

              handleFormSubmit(selected?.value);

              setShowDropdown(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

const CellTextSelect = ({
  options = [],
  value,
  handleFormSubmit,
  readOnly
}: any) => {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [cellValue, setCellValue] = React.useState(value);

  return (
    <div className="relative">
      <Popover
        open={showDropdown}
        onOpenChange={(val) => {
          if (!readOnly) {
            setShowDropdown(val);
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={`max-h-[30px] w-full bg-transparent hover:bg-transparent flex justify-start items-center`}
          >
            <div
              className={`h-full flex px-1 py-0 w-fit justify-start items-center bg-transparent hover:bg-gray-50 text-gray-500 hover:text-gray-500 font-normal hover:font-normal rounded-[6px]`}
            >
              <span className="text-slate-800 capitalize">{cellValue}</span>
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="center"
          className={`w-full min-w-[180px] bg-white shadow-lg border border-gray-100 rounded-lg px-2 py-1 text-xs`}
        >
          <SearchableSelect
            data={options}
            onSelectChange={(selected: any) => {
              setCellValue(selected?.label);

              handleFormSubmit(selected?.value);

              setShowDropdown(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

const CellBooleanSelect = ({
  options = [],
  value,
  handleFormSubmit,
  readOnly
}: any) => {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [cellValue, setCellValue] = React.useState(value);

  return (
    <div className="relative">
      <Popover
        open={showDropdown}
        onOpenChange={(val) => {
          if (!readOnly) {
            setShowDropdown(val);
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={`max-h-[30px] flex px-1 py-0 w-fit justify-start items-center bg-transparent hover:bg-gray-50 text-gray-500 hover:text-gray-500 font-normal hover:font-normal rounded-[6px]`}
          >
            <span className="text-slate-800 capitalize">{cellValue}</span>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="center"
          className={`w-full min-w-[180px] bg-white shadow-lg border border-gray-100 rounded-lg px-2 py-1 text-xs`}
        >
          <SearchableSelect
            data={options}
            onSelectChange={(selected: any) => {
              setCellValue(selected?.label);

              setShowDropdown(false);

              handleFormSubmit(selected?.value);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

function CellRenderer({
  value,
  type = 'text',
  options = [],
  handleFormSubmit,
  readOnly = false
}: any) {
  // if (!value && typeof value !== 'boolean') {
  //   return (
  //     <div>
  //       <span>-</span>
  //     </div>
  //   );
  // }

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
        <CellDate
          value={value}
          handleFormSubmit={handleFormSubmit}
          readOnly={readOnly}
        />
      );
    case 'select': {
      return (
        <CellSelect
          options={options}
          value={getLabelFromValue(value, options)}
          handleFormSubmit={handleFormSubmit}
          readOnly={readOnly}
        />
      );
    }
    case 'tag': {
      const { bg, border } = React.useMemo(() => getRandomTagColor(), []);

      return (
        <div
          className={`px-2 py-1 w-fit min-w-[30px] min-h-[30px] ${bg} ${border} text-gray-500 rounded-[6px]`}
        >
          <span>{value}</span>
        </div>
      );
    }
    case 'icon-tag': {
      return (
        <CellTagSelect
          options={options}
          value={getLabelFromValue(value, options)}
          handleFormSubmit={handleFormSubmit}
          readOnly={readOnly}
        />
      );
    }
    case 'avatar': {
      if (!value) {
        return <span className="capitalize text-gray-500">-</span>;
      }

      return (
        <div
          className={`py-1 flex items-center gap-x-1 bg-transparent text-gray-500 rounded-[6px]`}
        >
          <div className="rounded-full bg-green-50 font-medium text-green-400 p-2 h-6 w-6 flex justify-center items-center">
            <span className="uppercase">{getInitials(`${value}`)}</span>
          </div>
          <span className="capitalize">{value}</span>
        </div>
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
    case 'url': {
      if (!value) {
        return <span>-</span>;
      }

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
    }
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
    case 'text-tag':
      return (
        <CellTextSelect
          options={options}
          value={getLabelFromValue(value, options)}
          handleFormSubmit={handleFormSubmit}
          readOnly={readOnly}
        />
      );
    case 'boolean':
      return (
        <CellBooleanSelect
          options={options}
          value={value ? `${value}` : 'False'}
          handleFormSubmit={handleFormSubmit}
          readOnly={readOnly}
        />
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
  const [status, setStatus] = React.useState<string>('');

  React.useEffect(() => {
    if (tabFilters?.length && !status) {
      setStatus(tabFilters[0]?.value);
    }
  }, [tabFilters]);

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
  handleFormSubmit = () => {},
  readOnly = false,
  colorHeader = false,
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

  const onFilterSubmit = async (values: ProgramFilterSchema): Promise<void> => {
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

  const columnColors = React.useMemo(() => {
    return column.reduce(
      (acc: Record<string, { bg: string; border: string }>, col) => {
        acc[col.accessorKey] = getRandomTagColor();
        return acc;
      },
      {}
    );
  }, [column]);

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
                const { bg, border } = columnColors[item.accessorKey] || {};

                return (
                  <TableHead
                    key={`${item?.label}_${index}`}
                    className={cn(
                      'max-w-[200px] h-11 truncate !text-gray-500 !text-sm text-left font-medium text-inherit px-4',
                      index !== column.length - 1 ? 'border-r' : ''
                    )}
                  >
                    <span
                      className={cn(
                        colorHeader
                          ? `border rounded ${bg} ${border} px-2 py-1`
                          : ''
                      )}
                    >
                      {item?.label}
                    </span>
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
                        handleFormSubmit={(val: any) => {
                          handleFormSubmit(val, col.accessorKey, item.id, item);
                        }}
                        readOnly={readOnly}
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
            onSubmit={methods.handleSubmit(onFilterSubmit)}
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
