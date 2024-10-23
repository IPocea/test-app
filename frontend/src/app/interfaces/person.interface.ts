import { ICar } from './car.interface';

export interface IPersonPagination {
  data: IPerson[];
  pageIndex: number;
  pageSize: number;
  totalItems: number;
}

export interface IPerson {
  id?: number;
  firstName: string;
  lastName: string;
  CNP: string;
  age: number;
  cars: ICar[];
}
