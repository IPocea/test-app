import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoutePaths } from '@enums';
import { UiButtonModule } from '@shared/ui/ui-button/ui-button.module';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,

    // ui
    UiButtonModule,
  ],
  templateUrl: './header.component.html',
  styles: ``,
})
export class HeaderComponent {
  //#region constants
  APP_ROUTES = AppRoutePaths;
  //#endregion
}
