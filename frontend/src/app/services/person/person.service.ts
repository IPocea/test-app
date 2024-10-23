import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseUrl, Endpoints, PersonsEndpoints } from '@enums';
import {
  IMessageResponse,
  IPerson,
  IPersonPagination,
  IQueryParams,
} from '@interfaces';
import { setFiltersAsQueryParams } from '@utils';
import { Observable } from 'rxjs';

const BASE_URL = BaseUrl;
const API_ENDPOINTS = Endpoints;
const PERSONS_ENDPOINTS = PersonsEndpoints;

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  constructor(private _http: HttpClient) {}

  getAllPagination = (query: IQueryParams): Observable<IPersonPagination> => {
    const queryString = query ? setFiltersAsQueryParams(query) : '';
    return this._http.get<IPersonPagination>(
      BASE_URL.Url +
        API_ENDPOINTS.Persons +
        '/' +
        PERSONS_ENDPOINTS.FindAllPagination +
        queryString
    );
  };

  getOne = (id: number): Observable<IPerson> => {
    return this._http.get<IPerson>(
      BASE_URL.Url +
        API_ENDPOINTS.Persons +
        `/${id}/` +
        PERSONS_ENDPOINTS.FindOne
    );
  };

  add = (payload: IPerson): Observable<IPerson> => {
    return this._http.post<IPerson>(
      BASE_URL.Url + API_ENDPOINTS.Persons + '/' + PERSONS_ENDPOINTS.Add,
      payload
    );
  };

  editOne = (id: number, payload: IPerson): Observable<IMessageResponse> => {
    return this._http.put<IMessageResponse>(
      BASE_URL.Url + API_ENDPOINTS.Persons + `/${id}/` + PERSONS_ENDPOINTS.Edit,
      payload
    );
  };

  deleteOne = (id: number): Observable<IMessageResponse> => {
    return this._http.delete<IMessageResponse>(
      BASE_URL.Url +
        API_ENDPOINTS.Persons +
        `/${id}/` +
        PERSONS_ENDPOINTS.Delete
    );
  };
}
