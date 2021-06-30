import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalPageProgress } from './modal-page-progress';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ModalPageProgress,
  ],
  imports: [
    IonicPageModule.forChild(ModalPageProgress),
    TranslateModule.forChild()
  ],
  exports: [
    ModalPageProgress
  ]
})
export class ModalPageProgressModule {}
