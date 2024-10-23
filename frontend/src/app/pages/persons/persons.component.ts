import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PersonPageService } from './services/person-page.service';
import { UiMatSearchInputComponent } from '@shared/ui/ui-mat-search-input/ui-mat-search-input.component';
import { UiButtonModule } from '@shared/ui/ui-button/ui-button.module';
import { SharedIconsModule } from '@shared/modules/shared-icons.modules';
import { PersonsTableComponent } from './components/persons-table/persons-table.component';
import { IPerson, IQueryParams } from '@interfaces';
import { Subject, takeUntil } from 'rxjs';
import { StorageService } from '@services';
import { UiSpinnerComponent } from '@shared/ui/ui-spinner/ui-spinner.component';

@Component({
  selector: 'app-persons',
  standalone: true,
  imports: [
    CommonModule,

    // ui
    UiMatSearchInputComponent,
    UiButtonModule,
    UiSpinnerComponent,

    // components
    PersonsTableComponent,

    // shared
    SharedIconsModule,
  ],
  templateUrl: './persons.component.html',
})
export class PersonsComponent implements OnInit, OnDestroy {
  //#region injections
  private _title = inject(Title);
  private _pageService = inject(PersonPageService);
  private _storageService = inject(StorageService);
  //#endregion

  //#region observables
  private _unsubscribeAll$ = new Subject<null>();

  actionsLoading$ = this._pageService.onActionsLoading$;
  deletePersonLoading$ = this._pageService.onPersonDeleteLoading$;
  personsPaginationChange$ = this._pageService.onPersonsPaginationChange$;

  carsChange$ = this._pageService.onCarsChange$;
  carsLoading$ = this._pageService.onCarsLoading$;

  filtersChange$ = this._pageService.onFiltersChange$;
  //#endregion

  ngOnInit(): void {
    this._title.setTitle('Persoane');
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
    this._pageService.getAllPersonsPagination(
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
        this._pageService.getAllPersonsPagination(filters);
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

  hndClickGetCarsAndOpenAddModal = (): void => {
    this._pageService.getAllCarsForPerson();
  };

  hndOnFiltersEmitRequestPersons = (filters: IQueryParams): void => {
    this._pageService.updateFilters(filters);
  };

  hndOnEmitSelectEditPerson = (person: IPerson): void => {
    this._pageService.getAllCarsForPerson(person);
  };

  hndOnEmitDeletePerson = (person: IPerson): void => {
    this._pageService.showConfirmDeletePersonDialog(person);
  };
  //#endregion
}
