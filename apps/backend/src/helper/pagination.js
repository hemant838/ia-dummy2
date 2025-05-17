const getPagination = (query) => {
    // Parse page and limit with validation
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(query.limit, 10) || 10)); // Limit between 1 and 100
    const skip = (page - 1) * limit;
  
    return {
      skip,
      take: limit,
      page,
      limit,
    };
  };
  
  // Utility to build pagination metadata
  const buildPaginationMetadata = (page, limit, total) => {
    const totalPages = Math.ceil(total / limit);
    return {
      page,
      limit,
      total,
      totalPages,
      hasPrevious: page > 1,
      hasNext: page < totalPages,
    };
  };
  
  export const pagination = { getPagination, buildPaginationMetadata };