import { Injectable } from '@angular/core';
import { NotificationService } from '@shared/notification/services/notification.service';

@Injectable({
  providedIn: 'root',
})
export class SendErrorMessageService {
  constructor(private _notificationService: NotificationService) {}

  //#region public methods
  sendErrorMessage = (error: any): void => {
    if (
      error?.error?.error?.message &&
      Array.isArray(error.error.error.message)
    ) {
      for (const message of error.error.error.message) {
        this._notificationService.add({
          title: 'Atentie',
          message: message,
          type: 2,
        });
      }
    } else {
      this._notificationService.add({
        title: 'Atentie',
        message: error?.error?.message || 'O eroare neprevazuta a avut loc',
        type: 2,
      });
    }
  };
  //#endregion
}
