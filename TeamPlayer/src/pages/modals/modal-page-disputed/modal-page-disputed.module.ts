import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalPageDisputed } from './modal-page-disputed';

@NgModule({
  declarations: [
    ModalPageDisputed,
  ],
  imports: [
    IonicPageModule.forChild(ModalPageDisputed),
    TranslateModule.forChild()
  ],
  exports: [
    ModalPageDisputed
  ]
})
export class ModalPageDisputedModule { }
