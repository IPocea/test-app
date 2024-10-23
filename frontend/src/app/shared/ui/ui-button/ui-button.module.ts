import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiButtonDirective } from './directives/ui-button/ui-button.directive';
import { SharedIconsModule } from '@shared/modules/shared-icons.modules';

@NgModule({
  declarations: [UiButtonDirective],
  imports: [CommonModule, SharedIconsModule],
  exports: [UiButtonDirective],
})
export class UiButtonModule {}
