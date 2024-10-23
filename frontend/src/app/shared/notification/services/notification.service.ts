import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NewNotification, Notification } from '../notification.types';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  //#region Constants
  TIMEOUT = 10000;
  //#endregion

  //#region Observables
  onNotificationsChange$ = new BehaviorSubject<Notification[]>([]);
  //#endregion

  constructor() {}

  //#region Private Methods
  private _getNewId = () => uuid();
  //#endregion

  //#region Public Methods
  add = (notification: NewNotification) => {
    const newNotification: Notification = {
      id: this._getNewId(),
      ...notification,
    };
    const notifications = this.onNotificationsChange$.getValue();
    notifications.push(newNotification);
    this.onNotificationsChange$.next(notifications);
  };

  remove = (notificationId: string) => {
    const notifications = this.onNotificationsChange$.getValue();
    const index = notifications.findIndex((n) => n.id === notificationId);

    if (index > -1) {
      notifications.splice(index, 1);
      this.onNotificationsChange$.next(notifications);
    }
  };
  //#endregion
}
