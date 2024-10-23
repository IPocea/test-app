import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationContainerComponent } from './notification-container/notification-container.component';
import { NotificationComponent } from './notification/notification.component';
import { SharedIconsModule } from '@shared/modules/shared-icons.modules';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NotificationComponent,
    NotificationContainerComponent,
    // Shared
    SharedIconsModule,
  ],
  exports: [NotificationContainerComponent],
})
export class NotificationModule {}
