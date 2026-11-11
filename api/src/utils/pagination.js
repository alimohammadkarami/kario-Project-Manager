export const getOffset = (page, limit) => (page - 1) * limit;

export const buildPagination = ({ page, limit, total }) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});
