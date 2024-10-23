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
import { ICar, ICarPagination, IQueryParams } from '@interfaces';
import { StorageService } from '@services';
import { SharedIconsModule } from '@shared/modules/shared-icons.modules';

@Component({
  selector: 'app-cars-table',
  standalone: true,
  imports: [
    CommonModule,

    // materials
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,

    // shared
    SharedIconsModule,
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro }],
  templateUrl: './cars-table.component.html',
  styles: ``,
})
export class CarsTableComponent implements OnInit {
  //#region injections
  private _storageService = inject(StorageService);
  //#endregion

  //#region data variables
  @Input() carPagination: ICarPagination;
  @Input() loading: boolean;
  @Output() sendFilters = new EventEmitter<IQueryParams>();
  @Output() onCarDelete = new EventEmitter<ICar>();
  @Output() onCarEdit = new EventEmitter<ICar>();
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [];
  length: number;
  pageIndex: number;
  pageSize: number;
  pageSizeOptions: number[] = [];
  showFirstLastButtons: BooleanInput = true;
  dataSource = new MatTableDataSource<ICar>();
  filters: IQueryParams = null;
  //#endregion

  ngOnInit(): void {
    this._initMatTable();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['carPagination']) {
      this._updateMatTableOnChange(changes);
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  //#region private methods
  private _initMatTable(): void {
    const data = { ...this.carPagination };
    const pageSize: string = this._storageService.onChange$.value
      .pageSize as string;
    this.filters = {
      pageIndex: '0',
      pageSize: pageSize ? pageSize : '10',
    };
    this._checkIfDataAndUpdate(data);
    this.dataSource = new MatTableDataSource<ICar>(this.carPagination?.data);
    this._setPaginator(this.carPagination);
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
    const data = { ...this.carPagination };
    this._checkIfDataAndUpdate(data);
    this._setPaginator(this.carPagination);
    this.dataSource.data = changes['carPagination']?.currentValue?.data;
  }

  private _setPaginator(carPagination: ICarPagination): void {
    this.pageIndex = carPagination?.pageIndex;
    this.pageSize = carPagination?.pageSize;
    this.length = carPagination?.totalItems;
    this.pageSizeOptions = pageSizeOptions;
  }

  private _requestFilteredData(filters: IQueryParams): void {
    this.sendFilters.emit(filters);
  }

  private _resetFiltersObj(): void {
    this.filters = null;
  }

  private _checkIfDataAndUpdate(carPagination: ICarPagination): void {
    if (carPagination && carPagination.data?.length) {
      this.displayedColumns = [
        'id',
        'brand',
        'model',
        'yearOfManufacture',
        'cylindricalCapacity',
        'taxFee',
        'actions',
      ];
    } else {
      this.displayedColumns = ['Nicio masina'];
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

  hndOnClickDeleteCar = (car: ICar): void => {
    this.onCarDelete.emit(car);
  };

  hndOnClickEditCar = (car: ICar): void => {
    this.onCarEdit.emit(car);
  };
  //#endregion
}
