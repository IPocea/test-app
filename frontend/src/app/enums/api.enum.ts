export enum BaseUrls {
  Production = '',
  Development = 'http://localhost:8080/api/',
}

export enum BaseUrl {
  Url = BaseUrls.Development,
}

export enum Endpoints {
  Persons = 'persons',
  Cars = 'cars',
}

export enum PersonsEndpoints {
  FindAllPagination = 'find-all-pagination',
  FindOne = 'find-one',
  Add = 'add',
  Edit = 'edit',
  Delete = 'delete',
}

export enum CarsEndpoints {
  FindAll = 'find-all',
  FindAllPagination = 'find-all-pagination',
  FindOne = 'find-one',
  Add = 'add',
  Edit = 'edit',
  Delete = 'delete',
}
