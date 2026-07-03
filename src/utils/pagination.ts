export const getPagination = (pageQuery?: string, limitQuery?: string) => {
  const page = Math.max(Number(pageQuery) || 1, 1);
  const limit = Math.min(Math.max(Number(limitQuery) || 10, 1), 100);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};
