export type TableFilter = {
  showTabFilters?: boolean;
  lineItems?: Array<any>;
  column?: Array<any>;
  className?: string;
  totalPages?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  currentPage?: number;
  handleNextPage?: any;
  handlePrevPage?: any;
  tabFilters?: Array<any>;
  handleTabChange?: any;
  handleFormSubmit?: any;
  readOnly?: boolean;
};
