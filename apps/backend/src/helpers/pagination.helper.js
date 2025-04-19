const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

const getPaginationParams = (query) => {
  const page = Math.max(parseInt(query.page || DEFAULT_PAGE), 1);
  const pageSize = Math.min(
    Math.max(parseInt(query.pageSize || DEFAULT_PAGE_SIZE), 1),
    MAX_PAGE_SIZE
  );
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  return {
    page,
    pageSize,
    skip,
    take,
  };
};

const getPaginatedResponse = (data, total, page, pageSize) => {
  const totalPages = Math.ceil(total / pageSize);

  return {
    data,
    meta: {
      total,
      page,
      pageSize,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

module.exports = {
  getPaginationParams,
  getPaginatedResponse,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
}; 