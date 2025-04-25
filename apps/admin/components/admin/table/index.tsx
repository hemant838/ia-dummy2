'use client';

import * as React from 'react';
import { ChevronDown, InfoIcon } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormProvider
} from '@workspace/ui/components/form';
import { Input } from '@workspace/ui/components/input';
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

import SideDrawer from '~/components/admin/SideDrawer';
import TabList from '~/components/admin/tabs';
import { useZodForm } from '~/hooks/use-zod-form';
import {
  programFilterSchema,
  type ProgramFilterSchema
} from '~/schemas/filter/program-filter-schema';

export type TableFilter = {
  lineItems?: Array<any>;
  column?: Array<any>;
  className?: string;
};

const TableFilter = ({ handleDrawerOpenChange }: any): React.JSX.Element => {
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
          onClick={() => {
            handleDrawerOpenChange(true);
          }}
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
}: TableFilter): React.JSX.Element {
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
    console.log('here handleDrawerOpenChange', open);
    setShowFilterDrawer(!showFilterDrawer);
  };

  return (
    <div className="w-full relative space-y-4">
      <div className="w-full space-y-3">
        <TableFilter handleDrawerOpenChange={handleDrawerOpenChange} />
        <Table
          wrapperClassName="border border-border rounded-lg overflow-y-auto max-h-[526px] bg-white"
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
