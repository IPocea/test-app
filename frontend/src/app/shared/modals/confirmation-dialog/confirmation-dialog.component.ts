import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { SharedIconsModule } from '@shared/modules/shared-icons.modules';
import { UiButtonModule } from '@shared/ui/ui-button/ui-button.module';

export type ConfirmationDialogData = {
  title: string;
  paragraph: string;
};

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [
    CommonModule,

    // materials
    MatDialogModule,
    DragDropModule,

    // ui
    UiButtonModule,

    // shared
    SharedIconsModule,
  ],
  templateUrl: './confirmation-dialog.component.html',
  host: {
    class: 'flex flex-col gap-8 p-12',
  },
})
export class ConfirmationDialogComponent implements OnInit {
  //#region injection
  private _data: ConfirmationDialogData = inject(MAT_DIALOG_DATA);
  //#endregion

  //#region Data Variables
  title: string = '';
  paragraph: string = '';
  //#endregion

  ngOnInit(): void {
    if (!this._data) return;
    this.title = this._data.title ? this._data.title : 'Confirma anularea';
    this.paragraph = this._data.paragraph;
  }
}
