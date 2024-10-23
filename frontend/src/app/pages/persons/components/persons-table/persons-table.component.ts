import { BooleanInput } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';
import {
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { pageSizeOptions } from '@constants';
import { MatPaginatorIntlCro } from '@helpers';
import { IPerson, IPersonPagination, IQueryParams } from '@interfaces';
import { StorageService } from '@services';
import { SharedIconsModule } from '@shared/modules/shared-icons.modules';
import { SharedPipesModule } from '@shared/modules/shared-pipies.module';

@Component({
  selector: 'app-persons-table',
  standalone: true,
  imports: [
    CommonModule,

    // materials
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,

    // shared
    SharedIconsModule,
    SharedPipesModule,
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro }],
  templateUrl: './persons-table.component.html',
  styles: ``,
})
export class PersonsTableComponent implements OnInit {
  //#region injections
  private _storageService = inject(StorageService);
  //#endregion

  //#region data variables
  @Input() personPagination: IPersonPagination;
  @Input() loading: boolean;
  @Output() sendFilters = new EventEmitter<IQueryParams>();
  @Output() onPersonDelete = new EventEmitter<IPerson>();
  @Output() onPersonEdit = new EventEmitter<IPerson>();
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [];
  length: number;
  pageIndex: number;
  pageSize: number;
  pageSizeOptions: number[] = [];
  showFirstLastButtons: BooleanInput = true;
  dataSource = new MatTableDataSource<IPerson>();
  filters: IQueryParams = null;
  //#endregion

  ngOnInit(): void {
    this._initMatTable();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['personPagination']) {
      this._updateMatTableOnChange(changes);
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  //#region private methods
  private _initMatTable(): void {
    const data = { ...this.personPagination };
    const pageSize: string = this._storageService.onChange$.value
      .pageSize as string;
    this.filters = {
      pageIndex: '0',
      pageSize: pageSize ? pageSize : '10',
    };
    this._checkIfDataAndUpdate(data);
    this.dataSource = new MatTableDataSource<IPerson>(
      this.personPagination?.data
    );
    this._setPaginator(this.personPagination);
    this.dataSource.sortingDataAccessor = (
      data: any,
      sortHeaderId: string
    ): string => {
      if (typeof data[sortHeaderId] === 'string') {
        return data[sortHeaderId].toLocaleLowerCase();
      }
      return data[sortHeaderId];
    };
  }

  private _updateMatTableOnChange(changes: SimpleChanges): void {
    const data = { ...this.personPagination };
    this._checkIfDataAndUpdate(data);
    this._setPaginator(this.personPagination);
    this.dataSource.data = changes['personPagination']?.currentValue?.data;
  }

  private _setPaginator(personPagination: IPersonPagination): void {
    this.pageIndex = personPagination?.pageIndex;
    this.pageSize = personPagination?.pageSize;
    this.length = personPagination?.totalItems;
    this.pageSizeOptions = pageSizeOptions;
  }

  private _requestFilteredData(filters: IQueryParams): void {
    this.sendFilters.emit(filters);
  }

  private _resetFiltersObj(): void {
    this.filters = null;
  }

  private _resetSort(): void {
    if (this.sort) {
      this.sort.active = '';
      this.sort.direction = '';
      this.sort._stateChanges.next();
      this.dataSource.sort = this.sort;
    }
  }

  private _checkIfDataAndUpdate(personPagination: IPersonPagination): void {
    if (personPagination && personPagination.data?.length) {
      this.displayedColumns = [
        'id',
        'fullName',
        'CNP',
        'age',
        'cars',
        'actions',
      ];
    } else {
      this.displayedColumns = ['Nicio persoana'];
    }
  }
  //#endregion

  //#region handlers
  handlePageChange(ev: any): void {
    this._storageService.setOnChangeValue({ pageSize: ev.pageSize });
    this._resetFiltersObj();
    this.filters = {
      pageIndex: ev.pageIndex.toString(),
      pageSize: ev.pageSize.toString(),
    };
    if (this.sort.active || this.sort.direction !== '') {
      this.filters.sortBy = this.sort.active;
      this.filters.sortDirection = this.sort.direction;
    }
    this._requestFilteredData(this.filters);
  }

  hndOnSortData(sort: Sort | any) {
    this._resetFiltersObj();
    this.filters = {
      pageIndex: '0',
      pageSize: this.pageSize.toString(),
    };
    if (sort.active || sort.direction !== '') {
      this.filters.sortBy =
        sort.active === 'fullName' ? 'firstName' : sort.active;
      this.filters.sortDirection = sort.direction;
    }
    this._requestFilteredData(this.filters);
  }

  hndOnClickDeletePerson = (person: IPerson): void => {
    this.onPersonDelete.emit(person);
  };

  hndOnClickEditPerson = (person: IPerson): void => {
    this.onPersonEdit.emit(person);
  };
  //#endregion
}
