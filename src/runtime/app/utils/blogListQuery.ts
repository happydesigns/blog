export type BlogQueryValue = string | number | null | undefined | Array<string | number | null>
export type BlogQuery = Record<string, BlogQueryValue>

export interface BuildBlogListQueryOptions {
  page: number
  selectedCategory: string
  allLabel: string
  fixedCategory?: string
  resetPage?: boolean
}

export function readBlogQueryValue(value: BlogQueryValue): string | undefined {
  const resolved = Array.isArray(value) ? value[0] : value
  return resolved === null || resolved === undefined ? undefined : String(resolved)
}

export function readBlogPage(value: BlogQueryValue): number {
  const page = Number(readBlogQueryValue(value))
  return Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1
}

export function buildBlogListQuery(currentQuery: BlogQuery, options: BuildBlogListQueryOptions): BlogQuery {
  const query = { ...currentQuery }

  if (options.resetPage || options.page === 1)
    delete query.page
  else
    query.page = String(options.page)

  if (!options.fixedCategory) {
    if (options.selectedCategory === options.allLabel)
      delete query.category
    else
      query.category = options.selectedCategory
  }

  return query
}
