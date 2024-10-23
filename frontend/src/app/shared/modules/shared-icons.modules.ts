import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconsModule } from '@ng-icons/core';
import {
  tablerAlertCircle,
  tablerArrowLeft,
  tablerBriefcase,
  tablerCheck,
  tablerCircleCheck,
  tablerCircleX,
  tablerDeviceFloppy,
  tablerEdit,
  tablerEye,
  tablerEyeOff,
  tablerMail,
  tablerMapPin,
  tablerMenuDeep,
  tablerPaperclip,
  tablerPhone,
  tablerPlus,
  tablerSearch,
  tablerTrash,
  tablerUser,
  tablerX,
} from '@ng-icons/tabler-icons';

const TABLER_ICON_SET = {
  tablerAlertCircle,
  tablerArrowLeft,
  tablerBriefcase,
  tablerCheck,
  tablerCircleCheck,
  tablerCircleX,
  tablerDeviceFloppy,
  tablerEdit,
  tablerEye,
  tablerEyeOff,
  tablerMail,
  tablerMapPin,
  tablerMenuDeep,
  tablerPaperclip,
  tablerPhone,
  tablerPlus,
  tablerSearch,
  tablerTrash,
  tablerUser,
  tablerX,
};

@NgModule({
  declarations: [],
  imports: [
    CommonModule,

    // Third Party
    NgIconsModule.withIcons({
      ...TABLER_ICON_SET,
    }),
  ],
  exports: [NgIconsModule],
})
export class SharedIconsModule {}
