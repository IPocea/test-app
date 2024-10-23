import { Injectable } from '@angular/core';
import {
  ICar,
  IMessageResponse,
  IPerson,
  IPersonPagination,
  IQueryParams,
} from '@interfaces';
import { CarService, PersonService, SendErrorMessageService } from '@services';
import { NotificationService } from '@shared/notification/services/notification.service';
import { BehaviorSubject, combineLatest, finalize, map, take } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  AddEditPersonDialogComponent,
  AddEditPersonDialogData,
} from '../modals/add-edit-person-dialog/add-edit-person-dialog.component';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData,
} from '@shared/modals/confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class PersonPageService {
  //#region Observables
  onPersonsPaginationChange$ = new BehaviorSubject<IPersonPagination>(null);
  onPersonsPaginationLoading$ = new BehaviorSubject<boolean>(false);

  onPersonAddChange$ = new BehaviorSubject<IPerson>(null);
  onPersonAddLoading$ = new BehaviorSubject<boolean>(false);

  onPersonEditChange$ = new BehaviorSubject<IMessageResponse>(null);
  onPersonEditLoading$ = new BehaviorSubject<boolean>(false);

  onPersonDeleteChange$ = new BehaviorSubject<IMessageResponse>(null);
  onPersonDeleteLoading$ = new BehaviorSubject<boolean>(false);

  onCarsChange$ = new BehaviorSubject<ICar[]>([]);
  onCarsLoading$ = new BehaviorSubject<boolean>(false);

  onFiltersChange$ = new BehaviorSubject<IQueryParams>(null);

  onActionsLoading$ = new BehaviorSubject<boolean>(false);
  //#endregion

  //#region dialogRef
  private _addEditPersonDialogRef: MatDialogRef<AddEditPersonDialogComponent>;
  private _confirmationDeleltePersonDialogRef: MatDialogRef<ConfirmationDialogComponent>;
  //#endregion

  constructor(
    private _personService: PersonService,
    private _carService: CarService,
    private _notificationService: NotificationService,
    private _sendErrorMessageService: SendErrorMessageService,
    private _matDialog: MatDialog
  ) {
    combineLatest([
      this.onPersonAddLoading$,
      this.onPersonEditLoading$,
      this.onPersonDeleteLoading$,
    ])
      .pipe(map((values) => values.some((value) => value === true)))
      .subscribe((loading) => {
        this.onActionsLoading$.next(loading);
      });
  }

  //#region private methods
  private _getAllPersonsPagination = (query: IQueryParams): void => {
    this._personService
      .getAllPagination(query)
      .pipe(
        take(1),
        finalize(() => {
          this.onPersonsPaginationLoading$.next(false);
        })
      )
      .subscribe({
        next: (productsPagination) => {
          this.onPersonsPaginationChange$.next(productsPagination);
        },
        error: (error) => {
          this._sendErrorMessageService.sendErrorMessage(error);
        },
      });
  };

  private _getAllCarsForPerson = (person: IPerson = null): void => {
    this._carService
      .getAll()
      .pipe(
        take(1),
        finalize(() => {
          this.onCarsLoading$.next(false);
          this.showAddPersonDialog(person);
        })
      )
      .subscribe({
        next: (cars) => {
          this.onCarsChange$.next(cars);
        },
        error: (error) => {
          this._sendErrorMessageService.sendErrorMessage(error);
        },
      });
  };

  private _addPerson = (payload: IPerson): void => {
    this._personService
      .add(payload)
      .pipe(
        take(1),
        finalize(() => {
          this.onPersonAddLoading$.next(false);
        })
      )
      .subscribe({
        next: (person) => {
          this.onPersonAddChange$.next(person);
          this._notificationService.add({
            title: 'Succes',
            message: 'Persoana a fost adaugata cu succes',
            type: 1,
          });
          if (this._addEditPersonDialogRef) {
            this._addEditPersonDialogRef.close(true);
          }
        },
        error: (error) => {
          this._sendErrorMessageService.sendErrorMessage(error);
        },
      });
  };

  private _editPerson = (id: number, payload: IPerson): void => {
    this._personService
      .editOne(id, payload)
      .pipe(
        take(1),
        finalize(() => {
          this.onPersonEditLoading$.next(false);
        })
      )
      .subscribe({
        next: (message) => {
          this._notificationService.add({
            title: 'Succes',
            message: 'Persoana a fost modificata cu succes',
            type: 1,
          });
          if (this._addEditPersonDialogRef) {
            this._addEditPersonDialogRef.close(true);
          }
        },
        error: (error) => {
          this._sendErrorMessageService.sendErrorMessage(error);
        },
      });
  };

  private _deletePerson = (payload: IPerson): void => {
    this._personService
      .deleteOne(payload?.id)
      .pipe(
        take(1),
        finalize(() => {
          this.onPersonDeleteLoading$.next(false);
        })
      )
      .subscribe({
        next: (message) => {
          this._notificationService.add({
            title: 'Succes',
            message: 'Persoana a fost stearsa cu succes',
            type: 1,
          });
          this.getAllPersonsPagination(this.onFiltersChange$.value);
        },
        error: (error) => {
          this._sendErrorMessageService.sendErrorMessage(error);
        },
      });
  };
  //#endregion

  //#region public methods
  getAllPersonsPagination = (query: IQueryParams): void => {
    this.onPersonsPaginationLoading$.next(true);
    this._getAllPersonsPagination(query);
  };

  getAllCarsForPerson = (person: IPerson = null): void => {
    this.onCarsLoading$.next(true);
    this._getAllCarsForPerson(person);
  };

  addPerson = (payload: IPerson): void => {
    this.onPersonAddLoading$.next(true);
    this._addPerson(payload);
  };

  editPerson = (id: number, payload: IPerson): void => {
    this.onPersonEditLoading$.next(true);
    this._editPerson(id, payload);
  };

  deletePerson = (person: IPerson): void => {
    this.onPersonDeleteLoading$.next(true);
    this._deletePerson(person);
  };

  showAddPersonDialog = (person: IPerson): void => {
    const data: AddEditPersonDialogData = {
      person: person,
      cars: this.onCarsChange$.value,
    };
    this._addEditPersonDialogRef = this._matDialog.open(
      AddEditPersonDialogComponent,
      {
        data,
        disableClose: true,
      }
    );

    this._addEditPersonDialogRef.afterClosed().subscribe((response) => {
      if (response) {
        this.getAllPersonsPagination(this.onFiltersChange$.value);
      }
    });
  };

  showConfirmDeletePersonDialog = (person: IPerson): void => {
    const data: ConfirmationDialogData = {
      title: '',
      paragraph: `Esti sigur ca doresti sa stergi persoana ${
        person.firstName + ' ' + person.lastName
      }`,
    };
    this._confirmationDeleltePersonDialogRef = this._matDialog.open(
      ConfirmationDialogComponent,
      {
        data,
        disableClose: true,
      }
    );

    this._confirmationDeleltePersonDialogRef
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          this.deletePerson(person);
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
