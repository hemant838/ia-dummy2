'use client';

import * as React from 'react';
import { LogIn, Settings2 } from 'lucide-react';

import { routes } from '@workspace/routes';

import PageTitle from '~/components/admin/pageTitle';
import { RootTable } from '~/components/admin/table';

function parseKey(path: string): string {
  return path.split('.').pop() || path;
}

function buildPayload(
  path: string,
  value: any,
  pageName: string,
  context: any = {}
) {
  const keys = path.split('.');

  if (keys.length === 1) {
    // Top-level key: wrap under pageName
    return {
      [pageName]: {
        [keys[0]]: value
      }
    };
  }

  // Nested key: build object structure
  const result: any = {};
  let current = result;

  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      current[key] = value;
    } else {
      current[key] = {};
      current = current[key];
    }
  });

  // Check for 2-level structure like startup.investmentType
  if (keys.length === 2) {
    const rootKey = keys[0];
    const existing = context[rootKey];

    if (existing?.id) {
      result[rootKey].id = existing.id;
    }
  }

  return result;
}

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
  tabFilters = [],
  tabFilterByKey = '',
  readOnly = false
}: any): React.JSX.Element => {
  const [tableRowData, setTableRowData] = React.useState<any[]>(
    initialData?.tableRowData
  );
  const [metaData, setMetaData] = React.useState<any>(initialData?.metaData);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [tabFiltersOptions, setTabFiltersOptions] = React.useState<any>([]);

  const fetchAllThesis = async () => {
    let url = `/api/${apiEndpoint}`;

    const res = await fetch(url);

    const json: any = await res.json();

    const data = json.data || {};

    const filters = data.data.map((d: any) => {
      return {
        label: d.name,
        value: d.id
      };
    });

    setTabFiltersOptions(filters);

    fetchTableData(currentPage, filters[0]?.value);
  };

  function formatStartupsForStageTable(startups: any, tableColumns: any) {
    return startups.map((startup: any) => {
      const row: any = {};

      tableColumns.forEach((col: any) => {
        const key = col.accessorKey.split('.')[0];
        row[key] = key === startup.evaluationStage ? startup : null;
      });

      return row;
    });
  }

  const fetchTableData = async (page: number, filterByValue?: string) => {
    try {
      setIsLoading(true);

      let url = `/api/${apiEndpoint}?page=${page}`;

      if (
        tabFilterByKey &&
        tabFilterByKey !== 'id' &&
        filterByValue &&
        filterByValue !== 'all'
      ) {
        url = url + `&${tabFilterByKey}=${filterByValue}`;
      }

      if (
        tabFilterByKey &&
        tabFilterByKey === 'id' &&
        filterByValue &&
        filterByValue !== 'all'
      ) {
        url = `/api/${apiEndpoint}/` + `${filterByValue}`;
      }

      const res = await fetch(url);

      const json: any = await res.json();
      console.log('json', json);

      const data = json.data || {};

      if (pageName === 'thesis') {
        console.log(
          'here thesis startups ####',
          formatStartupsForStageTable(data.data.startups, tableColumn)
        );
        setTableRowData(
          formatStartupsForStageTable(data.data.startups, tableColumn) || []
        );
      } else {
        setTableRowData(data.data || []);
      }

      setMetaData(data.meta || {});
      setCurrentPage(page);

      if (pageName !== 'thesis') {
        setTabFiltersOptions(tabFilters);
      }
    } catch (error) {
      console.error(`Error fetching ${pageName}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTableData = async (id: string, payload = {}) => {
    try {
      setIsLoading(true);

      let url = `/api/${apiEndpoint}/${id}`;

      const res = await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });

      const json: any = await res.json();

      fetchTableData(currentPage);
    } catch (error) {
      console.error(`Error fetching ${pageName}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (pageName === 'thesis') {
      fetchAllThesis();
    }
  }, [pageName]);

  React.useEffect(() => {
    if (pageName !== 'thesis') {
      fetchTableData(currentPage); // Fetch initial data
    }
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
        readOnly={readOnly}
        colorHeader={pageName === 'thesis'}
        handleNextPage={(nextPage: number) => {
          fetchTableData(nextPage);
        }}
        handlePrevPage={(prevPage: number) => {
          fetchTableData(prevPage);
        }}
        tabFilters={tabFiltersOptions}
        handleTabChange={(val: string) => {
          fetchTableData(currentPage, val);
        }}
        handleFormSubmit={(
          val: string,
          key: string,
          rowId: string,
          rowData: any
        ) => {
          let payload = buildPayload(key, val, pageName, rowData);

          if (payload?.applications?.evaluationStage) {
            payload = {
              ...payload,
              startup: {
                evaluationStage: payload?.applications?.evaluationStage,
                id: rowData?.startup?.id
              }
            };
          }

          updateTableData(rowId, payload);
        }}
      />
    </div>
  );
};

export default PageRenderer;
