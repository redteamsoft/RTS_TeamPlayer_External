import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalPageEmail } from './modal-page-email';
import { TranslateModule } from '@ngx-translate/core';
import { IonTagsInputModule } from 'ionic-tags-input';

@NgModule({
  declarations: [
    ModalPageEmail,
  ],
  imports: [
    IonTagsInputModule,
    IonicPageModule.forChild(ModalPageEmail),
    TranslateModule.forChild()
  ],
  exports: [
    ModalPageEmail
  ]
})
export class ModalPageProgressModule {}
