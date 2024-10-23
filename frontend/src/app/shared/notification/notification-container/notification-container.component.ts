import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NotificationComponent } from '../notification/notification.component';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-notification-container',
  standalone: true,
  imports: [
    CommonModule,

    // components
    NotificationComponent,
  ],
  templateUrl: './notification-container.component.html',
  host: {
    class:
      'flex flex-col gap-2 fixed bottom-2 left-2 right-2 z-50 md:left-auto',
  },
})
export class NotificationContainerComponent {
  //#region Observables
  onNotifications$ = inject(NotificationService).onNotificationsChange$;
  //#endregion
}
