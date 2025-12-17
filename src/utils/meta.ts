export const meta = ({ search, page, limit, offset, total }: { search: string, page: number, limit: number, offset: number, total: number }) => {
  return {
    search,
    page,
    limit,
    offset,
    total
  };
}