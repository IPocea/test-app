import { Routes } from '@angular/router';
import { AppRoutePaths } from '@enums';

const APP_ROUTE_PATHS = AppRoutePaths;

export const routes: Routes = [
  {
    path: APP_ROUTE_PATHS.Persons,
    loadComponent: () =>
      import('./pages/persons/persons.component').then((c) => {
        return c.PersonsComponent;
      }),
  },
  {
    path: APP_ROUTE_PATHS.Cars,
    loadComponent: () =>
      import('./pages/cars/cars.component').then((c) => {
        return c.CarsComponent;
      }),
  },
  {
    path: '',
    redirectTo: APP_ROUTE_PATHS.Persons,
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: APP_ROUTE_PATHS.Persons,
    pathMatch: 'full',
  },
];
