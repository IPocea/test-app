import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { DEBOUNCE_TIME_SHORT } from '@constants';
import { SharedIconsModule } from '@shared/modules/shared-icons.modules';
import { Subject, debounceTime, takeUntil } from 'rxjs';

@Component({
  selector: 'ui-mat-search-input',
  standalone: true,
  imports: [
    CommonModule,

    // material
    ReactiveFormsModule,
    MatInputModule,

    // shared
    SharedIconsModule,
  ],
  templateUrl: './ui-mat-search-input.component.html',
  styles: ``,
})
export class UiMatSearchInputComponent implements OnInit, OnDestroy {
  //#region observables
  private _unsubscribeAll$ = new Subject<null>();
  //#endregion

  //#region data variables
  @Input() matFormFieldClassName: string;
  @Input() noMatLabel: boolean;
  @Input() noMatLabelClass: string;
  @Input() label: string;
  @Input() labelHintClass: string;
  @Input() labelHint: string;
  @Input() tablerIconNamePrefix: string;
  @Input() clearInputIcon: boolean;
  @Input() placeholder: string;
  @Output() onSearchValueEmit = new EventEmitter<string>();
  searchInputCtrl: FormControl = new FormControl<string>('');
  //#endregion

  ngOnInit(): void {
    this._subscribe();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll$.next(null);
    this._unsubscribeAll$.complete();
  }

  //#region private methods
  private _subscribe = (): void => {
    this._subscribeToSearchInputCtrl();
  };

  private _subscribeToSearchInputCtrl = (): void => {
    this.searchInputCtrl.valueChanges
      .pipe(debounceTime(DEBOUNCE_TIME_SHORT), takeUntil(this._unsubscribeAll$))
      .subscribe((searchValue) => {
        this.onSearchValueEmit.emit(searchValue);
      });
  };
  //#endregion

  //region handlers
  hndClickResetSearchInputCtrl = (): void => {
    this.searchInputCtrl.reset();
  };
  //#endregion
}
