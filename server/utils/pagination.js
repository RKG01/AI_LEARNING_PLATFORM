/**
 * Pagination utility functions
 */

/**
 * Get pagination parameters from query
 * @param {Object} query - Express query object
 * @param {Object} options - Default options
 * @returns {Object} Pagination parameters
 */
const getPaginationParams = (query, options = {}) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || options.defaultLimit || 10));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/**
 * Create pagination info object
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} totalCount - Total number of items
 * @returns {Object} Pagination info
 */
const createPaginationInfo = (page, limit, totalCount) => {
  const totalPages = Math.ceil(totalCount / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    currentPage: page,
    totalPages,
    totalCount,
    hasNextPage,
    hasPrevPage,
    limit,
    startIndex: (page - 1) * limit + 1,
    endIndex: Math.min(page * limit, totalCount)
  };
};

/**
 * Apply pagination to a Mongoose query
 * @param {Object} query - Mongoose query object
 * @param {Object} paginationParams - Pagination parameters
 * @returns {Object} Query with pagination applied
 */
const applyPagination = (query, paginationParams) => {
  const { skip, limit } = paginationParams;
  return query.skip(skip).limit(limit);
};

/**
 * Get sort parameters from query
 * @param {Object} query - Express query object
 * @param {string} defaultSort - Default sort field
 * @param {string} defaultOrder - Default sort order
 * @returns {Object} Sort object for Mongoose
 */
const getSortParams = (query, defaultSort = 'createdAt', defaultOrder = 'desc') => {
  const sortBy = query.sortBy || defaultSort;
  const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
  
  const sortObj = {};
  sortObj[sortBy] = sortOrder;
  
  return sortObj;
};

module.exports = {
  getPaginationParams,
  createPaginationInfo,
  applyPagination,
  getSortParams
};