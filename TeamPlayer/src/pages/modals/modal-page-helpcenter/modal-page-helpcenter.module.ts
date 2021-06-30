import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalPageHelpCenter } from './modal-page-helpcenter';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ModalPageHelpCenter,
  ],
  imports: [
    IonicPageModule.forChild(ModalPageHelpCenter),
    TranslateModule.forChild()
  ],
  exports: [
    ModalPageHelpCenter
  ]
})
export class ModalPageHelpCenterModule {}
