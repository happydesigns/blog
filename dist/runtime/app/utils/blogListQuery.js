export function readBlogQueryValue(value) {
  const resolved = Array.isArray(value) ? value[0] : value;
  return resolved === null || resolved === void 0 ? void 0 : String(resolved);
}
export function readBlogPage(value) {
  const page = Number(readBlogQueryValue(value));
  return Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1;
}
export function buildBlogListQuery(currentQuery, options) {
  const query = { ...currentQuery };
  if (options.resetPage || options.page === 1)
    delete query.page;
  else
    query.page = String(options.page);
  if (!options.fixedCategory) {
    if (options.selectedCategory === options.allLabel)
      delete query.category;
    else
      query.category = options.selectedCategory;
  }
  return query;
}
