import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SharedIconsModule } from '@shared/modules/shared-icons.modules';
import { UiButtonModule } from '@shared/ui/ui-button/ui-button.module';
import { UiMatSearchInputComponent } from '@shared/ui/ui-mat-search-input/ui-mat-search-input.component';
import { UiSpinnerComponent } from '@shared/ui/ui-spinner/ui-spinner.component';
import { CarPageService } from './services/car-page.service';
import { StorageService } from '@services';
import { Subject, takeUntil } from 'rxjs';
import { ICar, IQueryParams } from '@interfaces';
import { CarsTableComponent } from './components/cars-table/cars-table.component';

@Component({
  selector: 'app-cars',
  standalone: true,
  imports: [
    CommonModule,

    // ui
    UiMatSearchInputComponent,
    UiButtonModule,
    UiSpinnerComponent,

    // components
    CarsTableComponent,

    // shared
    SharedIconsModule,
  ],
  templateUrl: './cars.component.html',
  styles: ``,
})
export class CarsComponent implements OnInit, OnDestroy {
  //#region injections
  private _title = inject(Title);
  private _pageService = inject(CarPageService);
  private _storageService = inject(StorageService);
  //#endregion

  //#region observables
  private _unsubscribeAll$ = new Subject<null>();

  actionsLoading$ = this._pageService.onActionsLoading$;
  deleteCarLoading$ = this._pageService.onCarDeleteLoading$;
  carsPaginationChange$ = this._pageService.onCarsPaginationChange$;

  filtersChange$ = this._pageService.onFiltersChange$;
  //#endregion

  ngOnInit(): void {
    this._title.setTitle('Masini');
    this._subscribe();
    this._getData();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll$.next(null);
    this._unsubscribeAll$.complete();
  }

  //#region private methods
  private _getData = (): void => {
    const pageSize: string = this._storageService.onChange$.value
      .pageSize as string;
    this._pageService.getAllCarsPagination(
      pageSize ? { pageSize: pageSize } : null
    );
  };

  private _subscribe = (): void => {
    this._subscribeToFilters();
  };

  private _subscribeToFilters = (): void => {
    this.filtersChange$
      .pipe(takeUntil(this._unsubscribeAll$))
      .subscribe((filters) => {
        this._pageService.getAllCarsPagination(filters);
      });
  };
  //#endregion

  //#region handlers
  hndEmitSearch = (searchInput: string): void => {
    if (searchInput) {
      this._pageService.updateFilters({ searchValue: searchInput });
    } else {
      this._pageService.removeKeysInFilter(['searchValue']);
    }
  };

  hndOpenAddModal = (): void => {
    this._pageService.showAddEditCarDialog(null);
  };

  hndOnFiltersEmitRequestCars = (filters: IQueryParams): void => {
    this._pageService.updateFilters(filters);
  };

  hndOnEmitSelectEditCar = (car: ICar): void => {
    this._pageService.showAddEditCarDialog(car);
  };

  hndOnEmitDeleteCar = (car: ICar): void => {
    this._pageService.showConfirmDeleteCarDialog(car);
  };
  //#endregion
}
