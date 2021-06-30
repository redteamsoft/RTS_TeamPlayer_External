import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalPagePrior } from './modal-page-prior';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ModalPagePrior,
  ],
  imports: [
    IonicPageModule.forChild(ModalPagePrior),
    TranslateModule.forChild()
  ],
  exports: [
    ModalPagePrior
  ]
})
export class ModalPagePriorModule {}
