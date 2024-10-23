import { Component, Input, inject } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { NotificationType, Notification } from '../notification.types';
import { Subject, interval, take, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SharedIconsModule } from '@shared/modules/shared-icons.modules';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [
    CommonModule,

    // shared
    SharedIconsModule,
  ],
  templateUrl: './notification.component.html',
  host: {
    class:
      'relative flex flex-col bg-white shadow-md rounded-md p-4 w-full md:min-w-[20rem] overflow-hidden',
  },
})
export class NotificationComponent {
  //#region Constants
  private _notificationService = inject(NotificationService);
  TIMEOUT = this._notificationService.TIMEOUT;
  TICK_INTERVAL = 100;
  NOTIFICATION_TYPE = NotificationType;
  //#endregion

  //#region Observables
  private _unsubscribeAll$ = new Subject<null>();
  onTick$ = interval(this.TICK_INTERVAL).pipe(
    take(this.TIMEOUT / this.TICK_INTERVAL + 1),
  );
  //#endregion

  //#region Data Variables
  @Input() data: Notification;
  //#endregion

  constructor() {
    this._subscribe();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll$.next(null);
    this._unsubscribeAll$.complete();
  }

  //#region Subscriptions
  private _subscribe = () => {
    this.onTick$.pipe(takeUntil(this._unsubscribeAll$)).subscribe({
      complete: () => this._close(),
    });
  };
  //#endregion

  //#region Methods
  private _close = () => this._notificationService.remove(this.data?.id);
  //#endregion

  //#region Handlers
  hndClose = () => this._close();
  //#endregion
}
