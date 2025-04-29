'use client';

import * as React from 'react';
import { LogIn, Settings2 } from 'lucide-react';

import { routes } from '@workspace/routes';

import PageTitle from '~/components/admin/pageTitle';
import { RootTable } from '~/components/admin/table';

const pageActions = [
  {
    pageName: 'program',
    action: [
      {
        variant: 'secondary',
        label: 'Export',
        icon: LogIn,
        type: 'button',
        onClick: () => {}
      },
      {
        variant: 'default',
        label: 'Create program',
        type: 'link',
        route: routes.dashboard.admin.routes.programs.routes.CreateProgram
      }
    ]
  },
  {
    pageName: 'applications',
    action: [
      {
        variant: 'secondary',
        label: 'View Settings',
        icon: Settings2,
        type: 'button',
        onClick: () => {}
      },
      {
        variant: 'default',
        label: 'Export',
        icon: LogIn,
        type: 'button',
        onClick: () => {}
      }
    ]
  },
  {
    pageName: 'thesis',
    action: [
      {
        variant: 'secondary',
        label: 'View Settings',
        icon: Settings2,
        type: 'button',
        onClick: () => {}
      },
      {
        variant: 'default',
        label: 'Export',
        icon: LogIn,
        type: 'button',
        onClick: () => {}
      }
    ]
  },
  {
    pageName: 'companies',
    action: [
      {
        variant: 'secondary',
        label: 'View Settings',
        icon: Settings2,
        type: 'button',
        onClick: () => {}
      },
      {
        variant: 'default',
        label: 'Export',
        icon: LogIn,
        type: 'button',
        onClick: () => {}
      }
    ]
  },
  {
    pageName: 'contacts',
    action: [
      {
        variant: 'secondary',
        label: 'View Settings',
        icon: Settings2,
        type: 'button',
        onClick: () => {}
      },
      {
        variant: 'default',
        label: 'Export',
        icon: LogIn,
        type: 'button',
        onClick: () => {}
      }
    ]
  }
];

const PageRenderer = ({
  pageTitle = '',
  pageName = '',
  tableColumn = [],
  initialData = {
    metaData: {},
    tableRowData: []
  },
  apiEndpoint = '/',
  showTabFilters = false,
  tabFilters = []
}: any): React.JSX.Element => {
  const [tableRowData, setTableRowData] = React.useState<any[]>(
    initialData?.tableRowData
  );
  const [metaData, setMetaData] = React.useState<any>(initialData?.metaData);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const fetchTableData = async (page: number) => {
    try {
      setIsLoading(true);

      const res = await fetch(`/api/${apiEndpoint}?page=${page}`);

      const json: any = await res.json();

      console.log(`here ${pageName}`, json);

      const data = json.data || {};
      setTableRowData(data.data || []);
      setMetaData(data.meta || {});
      setCurrentPage(page);
    } catch (error) {
      console.error(`Error fetching ${pageName}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTableData(currentPage); // Fetch initial data
  }, [pageName]);

  return (
    <div className="relative h-full w-full space-y-3">
      <PageTitle
        title={pageTitle}
        pageName={pageName}
        pageActions={
          pageActions.find((act) => act.pageName === pageName)?.action
        }
      />

      <RootTable
        showTabFilters={showTabFilters}
        column={tableColumn}
        lineItems={tableRowData}
        totalPages={metaData?.totalPages}
        hasNextPage={metaData?.hasNextPage}
        hasPreviousPage={metaData?.hasPreviousPage}
        currentPage={currentPage}
        handleNextPage={(nextPage: number) => {
          fetchTableData(nextPage);
        }}
        handlePrevPage={(prevPage: number) => {
          fetchTableData(prevPage);
        }}
        tabFilters={tabFilters}
      />
    </div>
  );
};

export default PageRenderer;
