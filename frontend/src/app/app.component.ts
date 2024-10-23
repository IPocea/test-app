import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '@shared/components/header/header.component';
import { NotificationModule } from '@shared/notification/notification.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,

    // notification
    NotificationModule,

    // components
    HeaderComponent,
  ],
  templateUrl: './app.component.html',
  host: {
    class: 'flex flex-col',
  },
})
export class AppComponent {
  title = 'test-app-frontend';
}
