export interface Meta {
  search: string
  page: number
  limit: number
  offset: number
  total: number
  orderBy: string
  sortBy: string | "asc" | "desc"
}