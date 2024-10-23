import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseUrl, CarsEndpoints, Endpoints } from '@enums';
import {
  ICar,
  ICarPagination,
  IMessageResponse,
  IQueryParams,
} from '@interfaces';
import { setFiltersAsQueryParams } from '@utils';
import { Observable } from 'rxjs';

const BASE_URL = BaseUrl;
const API_ENDPOINTS = Endpoints;
const CARS_ENDPOINTS = CarsEndpoints;

@Injectable({
  providedIn: 'root',
})
export class CarService {
  constructor(private _http: HttpClient) {}

  getAll = (): Observable<ICar[]> => {
    return this._http.get<ICar[]>(
      BASE_URL.Url + API_ENDPOINTS.Cars + '/' + CARS_ENDPOINTS.FindAll
    );
  };

  getAllPagination = (query: IQueryParams): Observable<ICarPagination> => {
    const queryString = query ? setFiltersAsQueryParams(query) : '';
    return this._http.get<ICarPagination>(
      BASE_URL.Url +
        API_ENDPOINTS.Cars +
        '/' +
        CARS_ENDPOINTS.FindAllPagination +
        queryString
    );
  };

  getOne = (id: number): Observable<ICar> => {
    return this._http.get<ICar>(
      BASE_URL.Url + API_ENDPOINTS.Cars + `/${id}/` + CARS_ENDPOINTS.FindOne
    );
  };

  add = (payload: ICar): Observable<ICar> => {
    return this._http.post<ICar>(
      BASE_URL.Url + API_ENDPOINTS.Cars + '/' + CARS_ENDPOINTS.Add,
      payload
    );
  };

  editOne = (id: number, payload: ICar): Observable<IMessageResponse> => {
    return this._http.put<IMessageResponse>(
      BASE_URL.Url + API_ENDPOINTS.Cars + `/${id}/` + CARS_ENDPOINTS.Edit,
      payload
    );
  };

  deleteOne = (id: number): Observable<IMessageResponse> => {
    return this._http.delete<IMessageResponse>(
      BASE_URL.Url + API_ENDPOINTS.Cars + `/${id}/` + CARS_ENDPOINTS.Delete
    );
  };
}
