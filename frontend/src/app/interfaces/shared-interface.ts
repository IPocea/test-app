export interface IMessageResponse {
  message: string;
}

export interface IQueryParams {
  pageIndex?: string;
  pageSize?: string;
  searchValue?: string;
  sortBy?: string;
  sortDirection?: string;
}
