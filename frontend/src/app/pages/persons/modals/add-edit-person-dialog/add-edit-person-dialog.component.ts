import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { UiButtonModule } from '@shared/ui/ui-button/ui-button.module';
import { ICar, IPerson } from '@interfaces';
import { UiSpinnerComponent } from '@shared/ui/ui-spinner/ui-spinner.component';
import { SharedIconsModule } from '@shared/modules/shared-icons.modules';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { MatInput } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DIGITS_ONLY_PATTERN, NO_DIGITS_PATTERN } from '@patterns';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { DEBOUNCE_TIME_SHORT } from '@constants';
import { getAgeFromCNP } from '@helpers';
import { cleanForm } from '@utils';
import { PersonPageService } from '@pages/persons/services/person-page.service';
import { SharedPipesModule } from '@shared/modules/shared-pipies.module';

export type AddEditPersonDialogData = {
  person: IPerson;
  cars: ICar[];
};

@Component({
  selector: 'app-add-edit-person-dialog',
  standalone: true,
  imports: [
    CommonModule,

    // materials
    MatDialogModule,
    DragDropModule,
    ReactiveFormsModule,
    MatInput,
    MatFormFieldModule,

    // third party
    NgSelectModule,

    // ui
    UiButtonModule,
    UiSpinnerComponent,

    // shared
    SharedIconsModule,
    SharedPipesModule,
  ],
  templateUrl: './add-edit-person-dialog.component.html',
  styles: ``,
})
export class AddEditPersonDialogComponent implements OnInit, OnDestroy {
  //#region injection
  private _data: AddEditPersonDialogData = inject(MAT_DIALOG_DATA);
  private _pageService = inject(PersonPageService);
  //#endregion

  //#region observables
  private _unsubscribeAll$ = new Subject<null>();
  actionsLoading$ = this._pageService.onActionsLoading$;
  //#endregion

  //#region patterns
  NO_DIGITS_PATTERN = NO_DIGITS_PATTERN;
  DIGITS_ONLY_PATTERN = DIGITS_ONLY_PATTERN;
  //#endregion

  //#region Data Variables
  person: IPerson = null;
  cars: ICar[] = [];
  form: FormGroup;
  //#endregion

  ngOnInit(): void {
    this.person = this._data?.person;
    this.cars = this._data?.cars;
    this._setForm(this.person);
    this._subscribe();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll$.next(null);
    this._unsubscribeAll$.complete();
  }

  //#region private methods
  private _setForm = (person: IPerson) => {
    this.form = new FormGroup({
      firstName: new FormControl<string>(person?.firstName || null, [
        Validators.required,
        Validators.maxLength(255),
        Validators.pattern(this.NO_DIGITS_PATTERN),
      ]),
      lastName: new FormControl<string>(person?.lastName || null, [
        Validators.required,
        Validators.maxLength(255),
        Validators.pattern(this.NO_DIGITS_PATTERN),
      ]),
      CNP: new FormControl<string>(person?.CNP || null, [
        Validators.required,
        Validators.minLength(13),
        Validators.maxLength(13),
        Validators.pattern(this.DIGITS_ONLY_PATTERN),
      ]),
      age: new FormControl<number>(person?.age || null, [
        Validators.required,
        Validators.maxLength(3),
      ]),
      carIds: new FormControl(this._getExistingPersonCarIds()),
    });
  };

  private _getExistingPersonCarIds = (): number[] => {
    return this.person ? this.person.cars.map((car) => car.id) : [];
  };

  private _subscribe = (): void => {
    this._subscribeToCNPCtrl();
  };

  private _subscribeToCNPCtrl = (): void => {
    const CNPCtrl: FormControl = this.form.get('CNP') as FormControl;
    if (!CNPCtrl) return;
    CNPCtrl.valueChanges
      .pipe(debounceTime(DEBOUNCE_TIME_SHORT), takeUntil(this._unsubscribeAll$))
      .subscribe((value) => {
        const ageCtrl: FormControl = this.form.get('age') as FormControl;
        const age = getAgeFromCNP(value);
        if (!ageCtrl) return;
        ageCtrl.setValue(age);
        if (age === null) {
          ageCtrl.markAsTouched();
        }
      });
  };
  //#endregion

  //#region handlers
  hndClickAddPerson = (): void => {
    cleanForm(this.form);
    this._pageService.addPerson(this.form.getRawValue());
  };

  hndClickEditPerson = (): void => {
    cleanForm(this.form);
    this._pageService.editPerson(this.person?.id, this.form.getRawValue());
  };
  //#endregion
}
