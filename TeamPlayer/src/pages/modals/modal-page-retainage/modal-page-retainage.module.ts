import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalPageRetainage } from './modal-page-retainage';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ModalPageRetainage,
  ],
  imports: [
    IonicPageModule.forChild(ModalPageRetainage),
    TranslateModule.forChild()
  ],
  exports: [
    ModalPageRetainage
  ]
})
export class ModalPageRetainageModule {}
