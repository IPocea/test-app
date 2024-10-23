import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { DEBOUNCE_TIME_SHORT } from '@constants';
import { getTaxFeeFromCylindricalCapacity } from '@helpers';
import { ICar } from '@interfaces';
import { CarPageService } from '@pages/cars/services/car-page.service';
import { DIGITS_ONLY_PATTERN } from '@patterns';
import { SharedIconsModule } from '@shared/modules/shared-icons.modules';
import { UiButtonModule } from '@shared/ui/ui-button/ui-button.module';
import { UiSpinnerComponent } from '@shared/ui/ui-spinner/ui-spinner.component';
import { cleanForm } from '@utils';
import { Subject, debounceTime, takeUntil } from 'rxjs';

export type AddEditCarDialogData = {
  car: ICar;
};

@Component({
  selector: 'app-add-edit-car-dialog',
  standalone: true,
  imports: [
    CommonModule,

    // materials
    MatDialogModule,
    DragDropModule,
    ReactiveFormsModule,
    MatInput,
    MatFormFieldModule,

    // ui
    UiButtonModule,
    UiSpinnerComponent,

    // shared
    SharedIconsModule,
  ],
  templateUrl: './add-edit-car-dialog.component.html',
  styles: ``,
})
export class AddEditCarDialogComponent implements OnInit, OnDestroy {
  //#region injection
  private _data: AddEditCarDialogData = inject(MAT_DIALOG_DATA);
  private _pageService = inject(CarPageService);
  //#endregion

  //#region observables
  private _unsubscribeAll$ = new Subject<null>();
  actionsLoading$ = this._pageService.onActionsLoading$;
  //#endregion

  //#region patterns
  DIGITS_ONLY_PATTERN = DIGITS_ONLY_PATTERN;
  //#endregion

  //#region Data Variables
  car: ICar = null;
  form: FormGroup;
  //#endregion

  ngOnInit(): void {
    this.car = this._data?.car;
    this._setForm(this.car);
    this._subscribe();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll$.next(null);
    this._unsubscribeAll$.complete();
  }

  //#region private methods
  private _setForm = (car: ICar) => {
    const currentYear: number = new Date().getFullYear();
    this.form = new FormGroup({
      brand: new FormControl<string>(car?.brand || null, [
        Validators.required,
        Validators.maxLength(255),
      ]),
      model: new FormControl<string>(car?.model || null, [
        Validators.required,
        Validators.maxLength(255),
      ]),
      yearOfManufacture: new FormControl<number>(
        car?.yearOfManufacture || null,
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4),
          Validators.min(1886),
          Validators.max(currentYear),
          Validators.pattern(this.DIGITS_ONLY_PATTERN),
        ]
      ),
      cylindricalCapacity: new FormControl<number>(
        car?.cylindricalCapacity || null,
        [
          Validators.required,
          Validators.maxLength(4),
          Validators.pattern(this.DIGITS_ONLY_PATTERN),
        ]
      ),
      taxFee: new FormControl<number>(car?.taxFee || null, [
        Validators.required,
        Validators.maxLength(4),
      ]),
    });
  };

  private _subscribe = (): void => {
    this._subscribeToTaxFeeCtrl();
  };

  private _subscribeToTaxFeeCtrl = (): void => {
    const cylindricalCapacitytCrl: FormControl = this.form.get(
      'cylindricalCapacity'
    ) as FormControl;
    if (!cylindricalCapacitytCrl) return;
    cylindricalCapacitytCrl.valueChanges
      .pipe(debounceTime(DEBOUNCE_TIME_SHORT), takeUntil(this._unsubscribeAll$))
      .subscribe((value) => {
        const taxFeeCtrl: FormControl = this.form.get('taxFee') as FormControl;
        const taxFee = getTaxFeeFromCylindricalCapacity(value);
        if (!taxFeeCtrl) return;
        taxFeeCtrl.setValue(taxFee);
        if (taxFee === null) {
          taxFeeCtrl.markAsTouched();
        }
      });
  };
  //#endregion

  //#region handlers
  hndClickAddCar = (): void => {
    cleanForm(this.form);
    this._pageService.addCar(this.form.getRawValue());
  };

  hndClickEditCar = (): void => {
    cleanForm(this.form);
    this._pageService.editCar(this.car?.id, this.form.getRawValue());
  };
  //#endregion
}
