import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  ICar,
  ICarPagination,
  IMessageResponse,
  IQueryParams,
} from '@interfaces';
import { BehaviorSubject, combineLatest, finalize, map, take } from 'rxjs';
import {
  AddEditCarDialogComponent,
  AddEditCarDialogData,
} from '../modals/add-edit-car-dialog/add-edit-car-dialog.component';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData,
} from '@shared/modals/confirmation-dialog/confirmation-dialog.component';
import { CarService, SendErrorMessageService } from '@services';
import { NotificationService } from '@shared/notification/services/notification.service';

@Injectable({
  providedIn: 'root',
})
export class CarPageService {
  //#region Observables
  onCarsPaginationChange$ = new BehaviorSubject<ICarPagination>(null);
  onCarsPaginationLoading$ = new BehaviorSubject<boolean>(false);

  onCarAddChange$ = new BehaviorSubject<ICar>(null);
  onCarAddLoading$ = new BehaviorSubject<boolean>(false);

  onCarEditChange$ = new BehaviorSubject<IMessageResponse>(null);
  onCarEditLoading$ = new BehaviorSubject<boolean>(false);

  onCarDeleteChange$ = new BehaviorSubject<IMessageResponse>(null);
  onCarDeleteLoading$ = new BehaviorSubject<boolean>(false);

  onFiltersChange$ = new BehaviorSubject<IQueryParams>(null);

  onActionsLoading$ = new BehaviorSubject<boolean>(false);
  //#endregion

  //#region dialogRef
  private _addEditCarDialogRef: MatDialogRef<AddEditCarDialogComponent>;
  private _confirmationDelelteCarDialogRef: MatDialogRef<ConfirmationDialogComponent>;
  //#endregion

  constructor(
    private _carService: CarService,
    private _notificationService: NotificationService,
    private _sendErrorMessageService: SendErrorMessageService,
    private _matDialog: MatDialog
  ) {
    combineLatest([
      this.onCarAddLoading$,
      this.onCarEditLoading$,
      this.onCarDeleteLoading$,
    ])
      .pipe(map((values) => values.some((value) => value === true)))
      .subscribe((loading) => {
        this.onActionsLoading$.next(loading);
      });
  }

  //#region private methods
  private _getAllCarsPagination = (query: IQueryParams): void => {
    this._carService
      .getAllPagination(query)
      .pipe(
        take(1),
        finalize(() => {
          this.onCarsPaginationLoading$.next(false);
        })
      )
      .subscribe({
        next: (productsPagination) => {
          this.onCarsPaginationChange$.next(productsPagination);
        },
        error: (error) => {
          this._sendErrorMessageService.sendErrorMessage(error);
        },
      });
  };

  private _addCar = (payload: ICar): void => {
    this._carService
      .add(payload)
      .pipe(
        take(1),
        finalize(() => {
          this.onCarAddLoading$.next(false);
        })
      )
      .subscribe({
        next: (car) => {
          this._notificationService.add({
            title: 'Succes',
            message: 'Masina a fost adaugata cu succes',
            type: 1,
          });
          if (this._addEditCarDialogRef) {
            this._addEditCarDialogRef.close(true);
          }
        },
        error: (error) => {
          this._sendErrorMessageService.sendErrorMessage(error);
        },
      });
  };

  private _editCar = (id: number, payload: ICar): void => {
    this._carService
      .editOne(id, payload)
      .pipe(
        take(1),
        finalize(() => {
          this.onCarEditLoading$.next(false);
        })
      )
      .subscribe({
        next: (message) => {
          this._notificationService.add({
            title: 'Succes',
            message: 'Masina a fost modificata cu succes',
            type: 1,
          });
          if (this._addEditCarDialogRef) {
            this._addEditCarDialogRef.close(true);
          }
        },
        error: (error) => {
          this._sendErrorMessageService.sendErrorMessage(error);
        },
      });
  };

  private _deleteCar = (payload: ICar): void => {
    this._carService
      .deleteOne(payload?.id)
      .pipe(
        take(1),
        finalize(() => {
          this.onCarDeleteLoading$.next(false);
        })
      )
      .subscribe({
        next: (message) => {
          this._notificationService.add({
            title: 'Succes',
            message: 'Masina a fost stearsa cu succes',
            type: 1,
          });
          this.getAllCarsPagination(this.onFiltersChange$.value);
        },
        error: (error) => {
          this._sendErrorMessageService.sendErrorMessage(error);
        },
      });
  };
  //#endregion

  //#region public methods
  getAllCarsPagination = (query: IQueryParams): void => {
    this.onCarsPaginationLoading$.next(true);
    this._getAllCarsPagination(query);
  };

  addCar = (payload: ICar): void => {
    this.onCarAddLoading$.next(true);
    this._addCar(payload);
  };

  editCar = (id: number, payload: ICar): void => {
    this.onCarEditLoading$.next(true);
    this._editCar(id, payload);
  };

  deleteCar = (car: ICar): void => {
    this.onCarDeleteLoading$.next(true);
    this._deleteCar(car);
  };

  showAddEditCarDialog = (car: ICar): void => {
    const data: AddEditCarDialogData = {
      car,
    };
    this._addEditCarDialogRef = this._matDialog.open(
      AddEditCarDialogComponent,
      {
        data,
        disableClose: true,
        panelClass: 'lg:!max-w-[800px]',
      }
    );

    this._addEditCarDialogRef.afterClosed().subscribe((response) => {
      if (response) {
        this.getAllCarsPagination(this.onFiltersChange$.value);
      }
    });
  };

  showConfirmDeleteCarDialog = (car: ICar): void => {
    const data: ConfirmationDialogData = {
      title: '',
      paragraph: `Esti sigur ca doresti sa stergi masina ${
        car.brand + ' ' + car.model
      }`,
    };
    this._confirmationDelelteCarDialogRef = this._matDialog.open(
      ConfirmationDialogComponent,
      {
        data,
        disableClose: true,
        panelClass: 'lg:!max-w-[800px]',
      }
    );

    this._confirmationDelelteCarDialogRef
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          this.deleteCar(car);
        }
      });
  };

  resetFilters = (): void => {
    this.onFiltersChange$.next(null);
  };

  updateFilters = (newFilters: IQueryParams): void => {
    const filters: IQueryParams = this.onFiltersChange$.value;
    if (!filters) {
      this.onFiltersChange$.next(newFilters);
    } else {
      for (const key in newFilters) {
        filters[key] = newFilters[key];
      }
      this.onFiltersChange$.next(filters);
    }
  };

  removeKeysInFilter = (keys: string[]): void => {
    const filters: IQueryParams = this.onFiltersChange$.value;
    if (!filters) return;
    for (const key of keys) {
      if (filters.hasOwnProperty(key)) {
        delete filters[key];
      }
    }
    this.updateFilters(filters);
  };
  //#endregion
}
