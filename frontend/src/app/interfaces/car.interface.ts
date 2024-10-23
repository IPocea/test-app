export interface ICarPagination {
  data: ICar[];
  pageIndex: number;
  pageSize: number;
  totalItems: number;
}

export interface ICar {
  id?: number;
  brand: string;
  model: string;
  yearOfManufacture: number;
  cylindricalCapacity: number;
  taxFee: number;
}
